from multiprocessing import Process
from queue import Empty
import json
import time
import numpy as np


PUB_CALIBRATION = "sensor/calibration/data"


class Calibrator(Process):
    def __init__(self, publish_callback, sensor, data_queue):
        print("Starting calibrator")
        Process.__init__(self)

        self._publish = publish_callback
        self._data_queue = data_queue
        self._sensor = sensor

        self._buffer_idx = 0
        self._buffer_len = 200
        self._buffer = np.zeros((3, self._buffer_len), dtype=np.float64)

        self._cal = np.ones((3, 1))

    def run(self):
        while True:
            try:
                data = self._data_queue.get()
                if data[-1] == 'acc':
                    self._process_acc(data[0:-2])
                self._data_queue.task_done()

            except Empty:
                time.sleep(0.001)

    def _process_acc(self, data):
        self._buffer[:, self._buffer_idx] = np.array(data)
        self._buffer_idx += 1

        if self._buffer_idx >= self._buffer_len:
            self._cal = np.sqrt(np.mean(self._buffer * self._buffer, axis=1))
            self._publish_calibration()
            self._buffer_idx = 0

    def _publish_calibration(self):
        print("Publishing data for calibration")
        data = {
            "x": self._cal[0],
            "y": self._cal[1],
            "z": self._cal[2]
        }
        self._publish(PUB_CALIBRATION, json.dumps(data), qos=0)

    def get_calibration(self):
        return self._cal
