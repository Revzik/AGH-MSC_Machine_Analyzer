from threading import Thread
import json
import numpy as np
from topics import PUB_CALIBRATION


class Calibrator(Thread):
    def __init__(self, publish_callback, queue):
        print("Starting calibrator")
        super(Calibrator, self).__init__()

        self.is_running = False

        self.publish = publish_callback
        self.queue = queue

    def run(self):
        self.is_running = True

        self.buffer_idx = 0
        self.buffer_len = 200
        self.buffer = np.zeros((3, self.buffer_len), dtype=np.float64)

        self.cal = np.ones((3, 1))
        while self.is_running:
            data = self.queue.get()
            if data[-1] == 'acc':
                self.process_acc(data[0:-2])

    def stop(self):
        self.is_running = False

    def process_acc(self, data):
        self.buffer[:, self.buffer_idx] = np.array(data)
        self.buffer_idx += 1

        if self.buffer_idx >= self.buffer_len:
            self.cal = np.sqrt(np.mean(self.buffer * self.buffer, axis=1))
            self.publish_calibration()
            self.buffer_idx = 0

    def publish_calibration(self):
        print("Publishing data for calibration")
        data = {
            "x": self.cal[0],
            "y": self.cal[1],
            "z": self.cal[2]
        }
        self.publish(PUB_CALIBRATION, json.dumps(data), qos=0)
