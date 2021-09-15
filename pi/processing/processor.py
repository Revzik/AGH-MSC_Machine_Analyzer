from utils.topics import ACC_TAG, FREQ_TAG
from threading import Thread
import numpy as np
import time
import json
from utils.topics import PUB_DATA, PUB_RAW


class Processor(Thread):
    def __init__(self, stop_event, publish_callback, queue, config, calibration):
        print("Initializing data processor...")
        super(Processor, self).__init__()
        
        self.stop_event = stop_event

        self.publish = publish_callback
        self.queue = queue

        self.timestamp = 0

        self.config = config
        self.cal = calibration

        print("Processor initialized!")

    def run(self):
        self.main_buffer_idx = 0
        self.main_buffer_len = 3200
        self.main_buffer = np.zeros((4, self.main_buffer_len), dtype=np.float64)

        self.freq_buffer_idx = 0
        time_x = np.ones(100, dtype=np.float64) * np.finfo(np.float64).min
        time_y = np.zeros(100, dtype=np.float64)
        self.freq_buffer = np.stack([time_x, time_y])

        while not self.stop_event.is_set():
            data = self.queue.get()
            if data[-1] == ACC_TAG:
                self.process_acc(data[0:-1])
            elif data[-1] == FREQ_TAG:
                self.process_freq(data[0:-1])
    
    def process_acc(self, data):
        self.main_buffer[:, self.main_buffer_idx] = np.array(data)
        self.main_buffer_idx += 1

        if self.main_buffer_idx >= self.main_buffer_len:
            self.timestamp = time.time()

            self.publish_raw_data()
            
            self.main_buffer[3, :] = np.interp(self.main_buffer[3, :], self.freq_buffer[0, :], self.freq_buffer[1, :])
            self.main_buffer[0:3, :] = self.main_buffer[0:3, :] * self.cal
            self.publish_processed_data()

            self.main_buffer_idx = 0

    def process_freq(self, data):
        self.freq_buffer = np.roll(self.freq_buffer, -1, axis=1)
        self.freq_buffer[:, -1] = data

    def publish_raw_data(self):
        print("Publishing raw data")
        data = {
            "timestamp": self.timestamp,
            "x": self.main_buffer[0, :].tolist(),
            "y": self.main_buffer[1, :].tolist(),
            "z": self.main_buffer[2, :].tolist(),
            "t": self.main_buffer[3, :].tolist()
        }
        self.publish(PUB_RAW, json.dumps(data), qos=0)

    def publish_processed_data(self):
        print("Publishing processed data")
        data = {
            "timestamp": self.timestamp,
            "x": self.main_buffer[0, :].tolist(),
            "y": self.main_buffer[1, :].tolist(),
            "z": self.main_buffer[2, :].tolist(),
            "f": self.main_buffer[3, :].tolist()
        }
        self.publish(PUB_DATA, json.dumps(data), qos=0)
