from multiprocessing.connection import Connection
from queue import Empty
from typing import Tuple
import numpy as np
import json
from utils import SUB_CONFIG, SUB_ACQUISITION, SUB_CALIBRATION
from processing import Buffer, Analyzer, Calibrator
from sensors import Tacho, Sensor
from multiprocessing import Event, Queue
from arrayqueues import ArrayQueue


class Manager():
    def __init__(self, publish_pipe: Connection) -> None:
        print("Initializing manager...")

        self.publish_pipe: Connection = publish_pipe

        self.config: dict = {
            "fs": 3200,
            "range": 16,
            "dOrder": 0.1,
            "maxOrder": 10,
            "windowLength": 200,
            "windowOverlap": 50,
            "tachoPoints": 1,
            "averages": 10
        }
        self.cal_a: np.ndarray = np.ones((3, 1))
        self.cal_b: np.ndarray = np.zeros((3, 1))

        self.queue_in: Queue = Queue()
        self.data_queue: ArrayQueue = ArrayQueue(32)
        self.freq_queue: ArrayQueue = ArrayQueue(32)
        
        self.tacho: Tacho = Tacho(self.queue_in)
        self.sensor: Sensor = None
        self.buffer: Buffer = None
        self.analyzer: Analyzer = None
        self.calibrator: Calibrator = None

        self.stop_event: Event = Event()

        print("Manager initialized!")

    def process_action(self, topic: str, action: str) -> None:
        if topic == SUB_ACQUISITION:
            self.process_acquisition(action)
        elif topic == SUB_CALIBRATION:
            self.process_calibration(action)
        elif topic == SUB_CONFIG:
            self.process_config(action)

    def process_acquisition(self, message: str) -> None:
        if message == "start":
            self.start_acquisition()
        elif message == "stop":
            self.stop_processing()

    def process_calibration(self, message: str) -> None:
        if message == "start_check":
            self.start_calibration(True)
        elif message == "start_cal":
            self.start_calibration(False)
        elif message.startswith("stop"):
            self.stop_processing()
        elif message.startswith("{"):
            self.stop_processing()
            self.update_calibration(json.loads(message))

    def update_calibration(self, values: dict) -> None:
        x0 = (values["x0y"] + values["x0z"]) / 2
        y0 = (values["y0x"] + values["y0z"]) / 2
        z0 = (values["z0x"] + values["z0y"]) / 2

        self.cal_a[0] = 9.81 / (values["x1"] - x0)
        self.cal_a[1] = 9.81 / (values["y1"] - y0)
        self.cal_a[2] = 9.81 / (values["z1"] - z0)

        self.cal_b[0] = -self.cal_a[0] * x0
        self.cal_b[1] = -self.cal_a[1] * y0
        self.cal_b[2] = -self.cal_a[2] * z0

    def process_config(self, message: str) -> None:
        self.stop_processing()
        self.config = json.loads(message)

    def get_analyzer_buffer_length(self) -> Tuple[int, int]:
        win_len = int(self.config["fs"] * self.config["windowLength"] / 1000)
        win_step = int(win_len * (1 - self.config["windowOverlap"] / 100))
        n_windows = self.config["averages"]

        data_buffer_length = (n_windows - 1) * win_step + win_len
        freq_buffer_length = int(200 * data_buffer_length / self.config["fs"])

        return (data_buffer_length, freq_buffer_length)

    def get_calibrator_buffer_length(self) -> int:
        return int(self.config["fs"] / 10)

    def get_analyzer_params(self) -> Tuple[int, int, int, float, float]:
        win_len = int(self.config["fs"] * self.config["windowLength"] / 1000)
        win_step = int(win_len * (1 - self.config["windowOverlap"] / 100))
    
        return (win_len, win_step, self.config["averages"], self.config["dOrder"], self.config["maxOrder"])

    def start_acquisition(self) -> None:
        self.stop_processing()
        print("Starting acquisition...")
        try:

            self.stop_event.clear()

            self.tacho.start()
            self.sensor = Sensor(self.queue_in, self.stop_event, self.config["fs"], self.config["range"])
            self.sensor.start()

            data_buffer_length, freq_buffer_length = self.get_analyzer_buffer_length()
            self.buffer = Buffer(self.stop_event, self.queue_in, self.data_queue, self.freq_queue,
                                data_buffer_length, freq_buffer_length)
            self.buffer.start()

            win_len, win_step, n_averages, d_order, max_order = self.get_analyzer_params()
            self.analyzer = Analyzer(self.publish_pipe, self.stop_event, self.data_queue, self.freq_queue,
                                    self.cal_a, self.cal_b,
                                    self.config["fs"], win_len, win_step, n_averages, d_order, max_order)
            self.analyzer.start()
        except Exception as e:
            print(e)

    def start_calibration(self, check: bool) -> None:
        self.stop_processing()
        print("Starting acc calibration...")

        self.stop_event.clear()

        self.sensor = Sensor(self.queue_in, self.stop_event, self.config["fs"], self.config["range"])
        self.sensor.start()

        self.buffer = Buffer(self.stop_event, self.queue_in, self.data_queue, self.freq_queue,
                             self.get_calibrator_buffer_length())
        self.buffer.start()

        self.calibrator = Calibrator(self.publish_pipe, self.stop_event, self.data_queue, check, self.cal_a, self.cal_b)
        self.calibrator.start()

    def stop_processing(self) -> None:
        print("Stopping processing...")

        self.stop_event.set()
        # if self.sensor is not None:
        #     self.sensor.terminate()
        # if self.buffer is not None:
        #     self.buffer.terminate()
        # if self.calibrator is not None:
        #     self.calibrator.terminate()
        # if self.analyzer is not None:
        #     self.analyzer.terminate()
        
        print("Clearing queues")
        while True:
            try:
                self.queue_in.get(block=False)
            except Empty:
                break
        self.data_queue.clear()
        self.freq_queue.clear()
        print("Queues empty")
