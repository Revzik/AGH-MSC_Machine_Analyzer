from multiprocessing import Process, Queue
from queue import Empty
from acquisitor import Sensor
import numpy as np
import time
import json


PUB_RAW = "sensor/data/raw"
PUB_DATA = "sensor/data/processed"
PUB_CALIBRATION = "sensor/calibration/data"


class Processor(Process):
    def __init__(self, publish_callback):
        Process.__init__(self)

        self._publish = publish_callback

        self._data_queue = Queue()

        self._sensor = Sensor(self._data_queue)
        self._sensor.start()

        self._timestamp = 0

        self._main_buffer_idx = 0
        self._main_buffer_len = 1000
        self._main_buffer = np.zeros((4, self._main_buffer_len), dtype=np.float64)

        self._freq_buffer_idx = 0
        time_x = np.ones(100, dtype=np.float64) * np.finfo(np.float64).min
        time_y = np.zeros(100, dtype=np.float64)
        self._freq_buffer = np.stack([time_x, time_y])

    def __del__(self):
        self._sensor.join(30)

    def run(self):
        while True:
            try:
                data = self._data_queue.get()
                if data[-1] == 'acc':
                    self._process_acc(data[0:-1])
                elif data[-1] == 'freq':
                    self._process_freq(data[0:-1])

            except Empty:
                time.sleep(0.001)
    
    def _process_acc(self, data):
        self._main_buffer[:, self._main_buffer_idx] = np.array(data)
        self._main_buffer_idx += 1

        if self._main_buffer_idx >= self._main_buffer_len:
            self._timestamp = time.time()

            self._publish_raw_data()
            
            self._main_buffer[3, :] = np.interp(self._main_buffer[3, :], self._freq_buffer[1, :], self._freq_buffer[0, :])
            self._publish_processed_data()

            self._main_buffer_idx = 0

    def _process_freq(self, data):
        self._freq_buffer = np.roll(self._freq_buffer, -1, axis=1)
        self._freq_buffer[:, -1] = data

    def _publish_raw_data(self):
        print("Publishing raw data")
        data = {
            "timestamp": self._timestamp,
            "x": self._main_buffer[0, :].tolist(),
            "y": self._main_buffer[1, :].tolist(),
            "z": self._main_buffer[2, :].tolist(),
            "t": self._main_buffer[3, :].tolist()
        }
        self._publish(PUB_RAW, json.dumps(data), qos=0)

    def _publish_processed_data(self):
        print("Publishing processed data")
        data = {
            "timestamp": self._timestamp,
            "x": self._main_buffer[0, :].tolist(),
            "y": self._main_buffer[1, :].tolist(),
            "z": self._main_buffer[2, :].tolist(),
            "f": self._main_buffer[3, :].tolist()
        }
        self._publish(PUB_DATA, json.dumps(data), qos=0)

    def _publish_calibration(self):
        print("Publishing data for calibration")
        data = {
            "x": self._main_buffer[0, :].tolist(),
            "y": self._main_buffer[1, :].tolist(),
            "z": self._main_buffer[2, :].tolist()
        }
        self._publish(PUB_CALIBRATION, json.dumps(data), qos=0)
