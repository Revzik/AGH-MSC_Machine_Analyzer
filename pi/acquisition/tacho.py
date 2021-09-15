import gpiozero
import os
import time
from utils.topics import FREQ_TAG


TACHO_GPIO = int(os.getenv("TACHO_GPIO"))


class Tacho:
    def __init__(self, queue):
        print("Initializing tachometer...")

        self.running = False
        self.queue = queue

        self.tacho = gpiozero.DigitalInputDevice(TACHO_GPIO)
        self.tacho_prev_time = -1

        print("Tachometer initialized!")

    def start(self):
        self.tacho.when_activated = self._get_data

    def stop(self):
        self.tacho.when_activated = None

    def _get_data(self):
        if self.tacho_prev_time < 0:
            self.tacho_prev_time = time.time()
            return
        
        current_time = time.time()
        rotation_freq = 1 / (current_time - self.tacho_prev_time)
        self.tacho_prev_time = current_time

        self.queue.put([current_time, rotation_freq, FREQ_TAG])
