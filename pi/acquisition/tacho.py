import gpiozero
import os
import time
from utils.topics import FREQ_TAG
from threading import Thread


TACHO_GPIO = int(os.getenv("TACHO_GPIO"))
tacho_pin = gpiozero.DigitalInputDevice(TACHO_GPIO)


class Tacho(Thread):
    def __init__(self, queue):
        print("Initializing tachometer...")
        super(Tacho, self).__init__()

        self.running = False
        self.queue = queue

        self.tacho_prev_time = -1

        print("Tachometer initialized!")

    def run(self):
        print("Starting tachometer")
        self.running = True
        while self.running:
            tacho_pin.tacho.wait_for_active()
            self._get_data()
        print("Stopping tachometer")

    def stop(self):
        self.running = False

    def _get_data(self):
        if self.tacho_prev_time < 0:
            self.tacho_prev_time = time.time()
            return
        
        current_time = time.time()
        rotation_freq = 1 / (current_time - self.tacho_prev_time)
        self.tacho_prev_time = current_time

        self.queue.put([current_time, rotation_freq, FREQ_TAG])
