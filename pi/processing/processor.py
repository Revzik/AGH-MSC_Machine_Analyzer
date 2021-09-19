from utils.topics import ACC_TAG, FREQ_TAG
from processing.order_analysis import Analyzer
from threading import Thread
from multiprocessing import Event
from arrayqueues import ArrayQueue
import numpy as np
import time


class Processor(Thread):
    def __init__(self, stop_event, publish_callback, queue, config, calibration):
        print("Initializing data processor...")
        super(Processor, self).__init__()
        
        self.stop_event = stop_event

        self.publish = publish_callback
        self.queue_in = queue
        self.data_queue_out = ArrayQueue(16)
        self.freq_queue_out = ArrayQueue(16)

        self.config = config
        self.cal = calibration

        self.data_buffer_len = 100
        self.data_buffer_idx = 0
        self.data_buffer = np.zeros((4, self.data_buffer_len), dtype=np.float64)

        self.freq_buffer_idx = 0
        time_x = np.ones(100, dtype=np.float64) * np.finfo(np.float64).min
        time_y = np.zeros(100, dtype=np.float64)
        self.freq_buffer = np.stack([time_x, time_y])

        analyzer_stop_event = Event()
        self.analyzer = Analyzer(publish_callback, analyzer_stop_event, self.data_queue_out, self.freq_queue_out)

        print("Processor initialized!")

    def run(self):
        self.analyzer.start()
        while not self.stop_event.is_set():
            data = self.queue_in.get()
            if data[-1] == ACC_TAG:
                self.process_acc(data[0:-1])
            elif data[-1] == FREQ_TAG:
                self.process_freq(data[0:-1])
    
    def process_acc(self, data):
        self.data_buffer[:, self.data_buffer_idx] = np.array(data)
        self.data_buffer_idx += 1

        if self.data_buffer_idx >= self.data_buffer_len:
            self.data_queue_out.put(self.data_buffer)
            self.freq_queue_out.put(self.freq_buffer)
            self.data_buffer_idx = 0
            self.data_buffer = np.zeros((4, self.data_buffer_len), dtype=np.float64)

    def process_freq(self, data):
        self.freq_buffer = np.roll(self.freq_buffer, -1, axis=1)
        self.freq_buffer[:, -1] = data
