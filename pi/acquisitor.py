from threading import Thread
from smbus2.smbus2 import SMBus
from gpiozero import Button
import os
import time

SENSOR_BUS = int(os.getenv("SENSOR_BUS"))
SENSOR_ADDRESS = int(os.getenv("SENSOR_ADDRESS"), base=16)
TACHO_GPIO = int(os.getenv("TACHO_GPIO"))

SUSPEND_REGISTER = 0x30
SUSPEND_WAS_ON = 0xFF
SUSPEND_WAS_OFF = 0x00

RANGE_REGISTER = 0x22
RANGE_2G = 0x00
RANGE_4G = 0x01
RANGE_8G = 0x02
RANGE_16G = 0x03
RANGE_MULTIPLIER_2G = 4/256
RANGE_MULTIPLIER_4G = 8/256
RANGE_MULTIPLIER_8G = 16/256
RANGE_MULTIPLIER_16G = 32/256

FILTER_REGISTER = 0x20
FILTER_32HZ = 0x05
FILTER_64HZ = 0x04
FILTER_125HZ = 0x03
FILTER_250HZ = 0x02
FILTER_500HZ = 0x01
FILTER_1000HZ = 0x00

DATA_REGISTER_START = 0x04
DATA_X_REGISTER = 0x04
DATA_Y_REGISTER = 0x06
DATA_Z_REGISTER = 0x08


class Sensor(Thread):
    def __init__(self, queue):
        print("Initializing data acquisitor")
        super(Sensor, self).__init__()
        
        self.is_running = False

        self.queue = queue

        self.tacho = Button(TACHO_GPIO)
        self.sensor = SMBus(SENSOR_BUS)
        
        self.acc_range = RANGE_2G
        self.acc_multiplier = RANGE_MULTIPLIER_2G
        self.acc_filter = FILTER_1000HZ
        self.set_settings()

    def run(self):
        self.is_running = True

        self.tacho_prev_time = -1
        self.tacho.when_activated = self.detect_marker

        while self.is_running:
            start_time = time.time()
            data = self.read_axes()
            data.append(start_time)
            data.append('acc')
            self.queue.put(data)

            sleep_time = 0.001 - time.time() - start_time
            if sleep_time > 0:
                time.sleep(sleep_time)

        self.tacho.when_activated = None
        self.tacho.close()
        self.sensor.close()

    def stop(self):
        self.is_running = False

    def set_settings(self):
        self.sensor.write_byte_data(SENSOR_ADDRESS, RANGE_REGISTER, self.acc_range)
        self.sensor.write_byte_data(SENSOR_ADDRESS, FILTER_REGISTER, self.acc_filter)

    def convert(self, num):
        if num >= 128:
            return (num - 256) // 4
        return num // 4

    def read_axes(self):
        return [self.convert(x) for x in self.sensor.read_i2c_block_data(SENSOR_ADDRESS, DATA_REGISTER_START, 3)]

    def detect_marker(self):
        print("acq running")
        if self.tacho_prev_time < 0:
            self.tacho_prev_time = time.time()
            return
        
        current_time = time.time()
        rotation_freq = 1 / (current_time - self.tacho_prev_time)
        self.tacho_prev_time = current_time

        self.queue.put([current_time, rotation_freq, 'freq'])
