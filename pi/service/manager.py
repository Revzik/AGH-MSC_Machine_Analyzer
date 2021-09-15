from queue import Queue, Empty
import numpy as np
import json
from utils.topics import SUB_CONFIG, SUB_ACQUISITION, SUB_CALIBRATION
from processing.processor import Processor
from processing.calibrator import Calibrator
from acquisition.tacho import Tacho
from acquisition.adxl343 import do_acquisition
from threading import Thread, Event


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
        self.tacho = Tacho(self.queue)
        self.sensor = None
        self.processor = None
        self.stop_event = None

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
            self.config = json.loads(message)

    def process_config(self, message):
        self.stop_processor()
        self.config = json.loads(message)

    def start_acquisition(self):
        self.stop_processor()
        print("Starting acquisition...")

        self.stop_event = Event()

        self.tacho.start()
        self.sensor = Thread(target=do_acquisition, args=(self.stop_event, self.queue, self.config["fs"], self.config["range"]))
        self.sensor.start()

        self.processor = Processor(self.stop_event, self.publish_callback, self.queue, self.config, self.calibration)
        self.processor.start()


    def start_calibration(self):
        self.stop_processor()
        print("Starting acc calibration...")

        self.stop_event = Event()

        self.tacho.start()
        self.sensor = Thread(target=do_acquisition, args=(self.stop_event, self.queue, self.config["fs"], self.config["range"]))
        self.sensor.start()

        self.processor = Calibrator(self.stop_event, self.publish_callback, self.queue, self.calibration)
        self.processor.start()

    def stop_processor(self):
        print("Stopping processing...")

        if self.stop_event is not None:
            self.stop_event.set()

        if self.processor is not None:
            self.processor.join()

        if self.sensor is not None:
            self.sensor.join()

        self.tacho.stop()
        
        print("Clearing queue")
        while True:
            try:
                self.queue.get(block=False)
            except Empty:
                print("Queue empty")
                break
