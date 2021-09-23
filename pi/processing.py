from typing import List
from utils import *
from multiprocessing import Event, Process, Queue
from multiprocessing.connection import Connection
from arrayqueues import ArrayQueue
import numpy as np
import scipy.signal as sig
import time


class Buffer(Process):
    def __init__(self, stop_event: Event, input_queue: Queue, data_queue: ArrayQueue, freq_queue: ArrayQueue,
                 data_buffer_length:int = 3200, freq_buffer_length:int = 200) -> None:
        print("Initializing data buffer...")
        print("Data buffer length: {}".format(data_buffer_length))
        print("Frequency buffer length: {}".format(freq_buffer_length))
        super(Buffer, self).__init__()
        
        self.stop_event: Event = stop_event

        self.input_queue: Queue = input_queue
        self.data_queue: ArrayQueue = data_queue
        self.freq_queue: ArrayQueue = freq_queue

        self.data_buffer_len: int = data_buffer_length
        self.data_buffer_idx: int = 0
        self.data_buffer: np.ndarray = np.zeros((4, self.data_buffer_len), dtype=np.float64)

        time_x = np.ones(freq_buffer_length, dtype=np.float64) * np.finfo(np.float64).min
        time_y = np.zeros(freq_buffer_length, dtype=np.float64)
        self.freq_buffer: np.ndarray = np.stack([time_x, time_y])

        print("Buffer initialized!")

    def run(self) -> None:
        print("Starting buffering")
        while not self.stop_event.is_set():
            data = self.input_queue.get()
            if len(data) == 4:
                self.process_acc(data)
            elif len(data) == 2:
                self.process_freq(data)
        print("Stopping buffering")
    
    def process_acc(self, data: List[float]) -> None:
        self.data_buffer[:, self.data_buffer_idx] = np.array(data)
        self.data_buffer_idx += 1

        if self.data_buffer_idx >= self.data_buffer_len:
            self.data_queue.put(np.copy(self.data_buffer))
            self.freq_queue.put(np.copy(self.freq_buffer))
            self.data_buffer_idx = 0
            self.data_buffer = np.zeros((4, self.data_buffer_len), dtype=np.float64)

    def process_freq(self, data: List[float]) -> None:
        self.freq_buffer = np.roll(self.freq_buffer, -1, axis=1)
        self.freq_buffer[:, -1] = data


class Calibrator(Process):
    def __init__(self):
        print("Initializing calibrator...")
        super(Calibrator, self).__init__()

        print("Calibrator initialized!")


class Analyzer(Process):
    def __init__(self, publish_pipe: Connection, stop_event: Event, data_queue: ArrayQueue, freq_queue: ArrayQueue, 
                 fs: int, win_len: int, win_step: int, n_averages: int, d_order: float, max_order: float) -> None:
        print("Initializing analyzer process...")
        print("Sampling frequency: {} Hz".format(fs))
        print("Window length: {} samples".format(win_len))
        print("Window step: {} samples".format(win_step))
        print("Number of averages: {}".format(n_averages))
        print("Order delta: {} rev".format(d_order))
        print("Max order: {} rev".format(max_order))
        super(Analyzer, self).__init__()

        self.publish_pipe: Connection = publish_pipe

        self.stop_event: Event = stop_event

        self.data_queue: ArrayQueue = data_queue
        self.freq_queue: ArrayQueue = freq_queue

        self.fs: int = fs
        self.win_len: int = win_len
        self.win_step: int = win_step
        self.n_averages: int = n_averages
        self.d_order: float = d_order
        self.max_order: float = max_order

        self.b, self.a = sig.butter(27, 0.8, btype='low', analog=False)
        
        print("Analyzer initialized!")

    def run(self) -> None:
        print("starting analyzer")
        while not self.stop_event.is_set():
            print("Awaiting data!")
            timestamp = time.time()
            data = self.data_queue.get()
            freq = self.freq_queue.get()
            print("Got data!")

            self.analyze_and_send(timestamp, data, freq)
        print("Stopping analyzer")

    def analyze_and_send(self, timestamp: float, data: np.ndarray, shaft_freq: np.ndarray) -> None:
        self.send_raw_data(timestamp, data)
        x, y, z, f = self.preprocess(data, shaft_freq)
        spec_x, spec_y, spec_z = self.order_spectrum(x, y, z, f)
        self.send_debug_data(timestamp, spec_x, spec_y, spec_z)

    def preprocess(self, data: np.ndarray, shaft_freq: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        # Get shaft frequency for every data sample
        freq = np.interp(data[3, :], shaft_freq[0, :], shaft_freq[1, :])
        data = data[0:3, :] * 9.81 * 32 / 8192

        # Remove DC offset
        means = np.mean(data, axis=1)
        data = data - means.reshape(3, 1)

        # Lowpass filter at 0.4 fs
        data = sig.lfilter(self.b, self.a, data, axis=1)

        return (data[0, :], data[1, :], data[2, :], freq)

    def order_spectrum(self, x: np.ndarray, y: np.ndarray, z: np.ndarray, f: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        X, Y, Z, F = self.window(x, y, z, f)
        return (np.mean(X, axis=0), np.mean(Y, axis=0), np.mean(Z, axis=0))

    def window(self, x: np.ndarray, y: np.ndarray, z: np.ndarray, f: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        X = np.zeros((self.n_averages, self.win_len))
        Y = np.zeros((self.n_averages, self.win_len))
        Z = np.zeros((self.n_averages, self.win_len))
        F = np.zeros((self.n_averages, self.win_len))

        j = 0
        for i in range(self.n_averages):
            X[i, :] = x[j:j + self.win_len]
            Y[i, :] = y[j:j + self.win_len]
            Z[i, :] = z[j:j + self.win_len]
            F[i, :] = f[j:j + self.win_len]
            j += self.win_step

        return (X, Y, Z, F)

    def send_raw_data(self, timestamp: float, data: np.ndarray) -> None:
        print("Publishing raw data")
        data = {
            "timestamp": timestamp,
            "x": data[0, :].tolist(),
            "y": data[1, :].tolist(),
            "z": data[2, :].tolist(),
            "t": data[3, :].tolist()
        }
        self.publish_pipe.send(pack(PUB_RAW, data, 0))

    def send_debug_data(self, timestamp: float, x: np.ndarray, y: np.ndarray, z: np.ndarray) -> None:
        print("Publishing debug data")
        data = {
            "timestamp": timestamp,
            "x": x.tolist(),
            "y": y.tolist(),
            "z": z.tolist(),
            "t0": 0,
            "dt": 1 / self.fs,
            "nt": x.size
        }
        self.publish_pipe.send(pack(PUB_DEBUG, data, 0))
