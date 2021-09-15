from threading import Thread
import json
import numpy as np
from utils.topics import PUB_CALIBRATION


class Calibrator(Thread):
    def __init__(self, stop_event, publish_callback, queue, calibration):
        print("Initializing calibrator...")
        super(Calibrator, self).__init__()
        
        self.stop_event = stop_event

        self.publish = publish_callback
        self.queue = queue
        
        self.calibration = calibration

        print("Calibrator initialized!")

    def run(self):
        self.is_running = True

        self.buffer_idx = 0
        self.buffer_len = 320
        self.buffer = np.zeros((3, self.buffer_len), dtype=np.float64)

        self.cal = np.ones((3, 1))
        while not self.stop_event.is_set():
            data = self.queue.get()
            if data[-1] == 'acc':
                self.process_acc(data[0:-2])

    def stop(self):
        self.is_running = False

    def process_acc(self, data):
        self.buffer[:, self.buffer_idx] = np.array(data)
        self.buffer_idx += 1

        if self.buffer_idx >= self.buffer_len:
            self.cal = np.mean(self.buffer, axis=1)
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
