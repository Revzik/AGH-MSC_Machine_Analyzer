from queue import Queue, Empty
import numpy as np
import json
from utils.topics import SUB_CONFIG, SUB_ACQUISITION, SUB_CALIBRATION
from processing.processor import Processor
from processing.calibrator import Calibrator
from acquisition.adxl343 import Sensor
from acquisition.tacho import Tacho

def create_action(topic, message):
    return {
        "topic": topic,
        "message": message
    }

class Manager():
    def __init__(self, publish_callback):
        print("Initializing manager...")

        self.publish_callback = publish_callback

        self.config = {
            "fs": 3200,
            "range": 16,
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
        self.tacho = None
        self.processor = None

        print("Manager initialized!")

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
        self.stop_processor()
        self.config = message

    def start_acquisition(self):
        self.stop_processor()
        print("Starting acquisition...")

        print("zzz")
        self.tacho = Tacho(self.queue)
        print("aaa")
        self.tacho.start()
        print("bbb")
        self.processor = Processor(self.publish_callback, self.queue, self.config, self.calibration)
        print("bbc")
        self.processor.start()
        print("bcc")
        # Why does it get stuck here? :C
        # Maybe instead of classes use just functions with stop events? https://stackoverflow.com/questions/18018033/how-to-stop-a-looping-thread-in-python
        self.sensor = Sensor(self.queue, self.config["fs"], self.config["range"])
        print("ccc")
        self.sensor.start()
        print("ddd")


    def start_calibration(self):
        self.stop_processor()
        print("Starting acc calibration...")

        self.tacho = Tacho(self.queue)
        self.tacho.start()
        self.sensor = Sensor(self.queue, self.config["fs"], self.config["range"])
        self.sensor.start()

        self.processor = Calibrator(self.publish_callback, self.queue, self.calibration)
        self.processor.start()

    def stop_processor(self):
        print("Stopping processing...")

        if self.processor is not None:
            self.processor.stop()
            self.processor = None

        if self.sensor is not None:
            self.sensor.stop()
            self.sensor = None

        if self.tacho is not None:
            self.tacho.stop()
            self.tacho = None
        
        print("Clearing queue")
        while True:
            try:
                self.queue.get(block=False)
            except Empty:
                print("Queue empty")
                break
