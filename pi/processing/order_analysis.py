import numpy as np
import json
import time
from multiprocessing import Process
from utils.topics import PUB_DATA, PUB_RAW


class Analyzer(Process):
    def __init__(self, publish_callback, stop_event, data_queue, freq_queue):
        print("Initializing analyzer process...")
        try:
            super(Analyzer, self).__init__()

            self.publish = publish_callback

            self.stop_event = stop_event

            self.data_queue = data_queue
            self.freq_queue = freq_queue
        except Exception as e:
            print(e)
        print("Analyzer initialized!")

    def run(self):
        while not self.stop_event.is_set():
            data = self.data_queue.get(block=True)
            freq = self.freq_queue.get(block=True)

            self.analyze(data, freq)

    def publish_raw_data(self, data):
        print("Publishing raw data")
        data = {
            "timestamp": time.time(),
            "x": data[0, :].tolist(),
            "y": data[1, :].tolist(),
            "z": data[2, :].tolist(),
            "t": data[3, :].tolist()
        }
        self.publish(PUB_RAW, json.dumps(data), qos=0)

    def publish_processed_data(self, data):
        print("Publishing processed data")
        data = {
            "timestamp": time.time(),
            "x": data[0, :].tolist(),
            "y": data[1, :].tolist(),
            "z": data[2, :].tolist(),
            "f": data[3, :].tolist()
        }
        self.publish(PUB_DATA, json.dumps(data), qos=0)

    def analyze(self, data, freq):
        self.publish_raw_data(data)
        data[3, :] = np.interp(data[3, :], freq[0, :], freq[1, :])
        data[0:3, :] = data[0:3, :] * 9.81 * 32 / 8192
        # publish_processed_data(publish, timestamp, data)
