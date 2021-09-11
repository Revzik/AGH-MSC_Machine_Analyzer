from queue import Queue, Empty
import numpy as np
import json
from topics import SUB_CONFIG, SUB_ACQUISITION, SUB_CALIBRATION
from processor import Processor
from calibrator import Calibrator
from acquisitor import Sensor

def create_action(topic, message):
    return {
        "topic": topic,
        "message": message
    }

class Manager():
    def __init__(self, publish_callback):
        print("Initializing manager")

        self.publish_callback = publish_callback

        self.config = {
            "lowpass": 250,
            "range": 4,
            "dOrder": 0.1,
            "maxOrder": 10,
            "windowLength": 200,
            "windowOverlap": 50,
            "tachoPoints": 1,
            "averages": 10
        }
        self.calibration = np.ones((3, 1))

        self.queue = Queue()
        self.sensor = None
        self.processor = None

    def process_action(self, topic, action):
        if topic == SUB_ACQUISITION:
            self.process_acquisition(action)
        elif topic == SUB_CALIBRATION:
            self.process_calibration(action)
        elif topic == SUB_CONFIG:
            self.process_config(action)

    def process_acquisition(self, message):
        if message == "start":
            self.start_acquisition()
        elif message == "stop":
            self.stop_processor()

    def process_calibration(self, message):
        if message == "start_simple":
            self.start_calibration()
        elif message == "stop":
            self.stop_processor()
        elif message.startswith("{"):
            self.stop_processor()
            self.config = json.dumps(message)

    def process_config(self, message):
        print(message)

    def start_acquisition(self):
        print("Stopping previous processes")
        self.stop_processor()

        print("Creating processes")
        print("Creating sensor")
        self.sensor = Sensor(self.queue)
        print("Creating processor")
        self.processor = Processor(self.publish_callback, self.queue, self.config, self.calibration)

        print("Starting processes")
        self.sensor.start()
        self.processor.start()

    def start_calibration(self):
        print("Stopping previous processes")
        self.stop_processor()

        print("Creating processes")
        print("Creating sensor")
        self.sensor = Sensor(self.queue)
        print("Creating calibrator")
        self.processor = Calibrator(self.publish_callback, self.queue)
        
        print("Starting processes")
        self.sensor.start()
        self.processor.start()

    def stop_processor(self):
        if self.sensor is not None and self.sensor.is_running:
            self.sensor.stop()
        if self.processor is not None and self.processor.is_running:
            self.processor.stop()
        
        while True:
            try:
                print("Clearing queue")
                self.queue.get(block=False)
            except Empty:
                print("Queue empty")
                break

        if self.sensor is not None:
            self.sensor.join()
        if self.processor is not None:
            self.processor.join()
