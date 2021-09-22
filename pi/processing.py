from typing import List
from utils import *
from multiprocessing import Event, Process, Queue
from multiprocessing.connection import Connection
from arrayqueues import ArrayQueue
import numpy as np
import time


class Buffer(Process):
    def __init__(self, stop_event: Event, input_queue: Queue, data_queue: ArrayQueue, freq_queue: ArrayQueue,
                 data_buffer_length:int = 3200, freq_buffer_length:int = 200) -> None:
        print("Initializing data buffer...")
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
        while not self.stop_event.is_set():
            data = self.input_queue.get()
            if len(data) == 4:
                self.process_acc(data)
            elif len(data) == 2:
                self.process_freq(data)
    
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
                 win_len: int, win_step: int, n_averages: int, d_order: float, max_order: float) -> None:
        print("Initializing analyzer process...")
        super(Analyzer, self).__init__()

        self.publish_pipe: Connection = publish_pipe

        self.stop_event: Event = stop_event

        self.data_queue: ArrayQueue = data_queue
        self.freq_queue: ArrayQueue = freq_queue

        self.win_len: int = win_len
        self.win_step: int = win_step
        self.n_averages: int = n_averages
        self.d_order: float = d_order
        self.max_order: float = max_order
        
        print("Analyzer initialized!")

    def run(self) -> None:
        print("starting analyzer")
        try:
            while not self.stop_event.is_set():
                print("Awaiting data!")
                timestamp = time.time()
                data = self.data_queue.get()
                freq = self.freq_queue.get()
                print("Got data!")

                self.analyze(timestamp, data, freq)
        except Exception as e:
            print(e)

    def send_raw_data(self, timestamp: float, data: np.ndarray) -> dict:
        print("Publishing raw data")
        data = {
            "timestamp": timestamp,
            "x": data[0, :].tolist(),
            "y": data[1, :].tolist(),
            "z": data[2, :].tolist(),
            "t": data[3, :].tolist()
        }
        self.publish_pipe.send(pack(PUB_RAW, data, 0))

    def analyze(self, timestamp: float, data: np.ndarray, freq):
        self.send_raw_data(timestamp, data)
        data[3, :] = np.interp(data[3, :], freq[0, :], freq[1, :])
        data[0:3, :] = data[0:3, :] * 9.81 * 32 / 8192
        # publish_processed_data(publish, timestamp, data)
