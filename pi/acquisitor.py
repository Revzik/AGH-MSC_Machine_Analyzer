from multiprocessing import Process
from smbus2.smbus2 import SMBus
from gpiozero import Button
import os
import time


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


class Sensor(Process):
    def __init__(self, data_pipe):
        print("Starting data acquisition")
        Process.__init__(self)
        
        self._data_pipe = data_pipe

        self._acc_sensor_address = int(os.getenv("SENSOR_ADDRESS"), base=16)
        self._acc_sensor_bus = int(os.getenv("SENSOR_BUS"))
        self._acc_sensor = SMBus(1)

        self._tacho_gpio = int(os.getenv("TACHO_GPIO"))
        self._tacho = Button(self._tacho_gpio)
        self._tacho_prev_time = -1
        self._tacho.when_activated = self._detect_marker

    def _convert(self, num):
        if num >= 128:
            return (num - 256) // 4
        return num // 4

    def _read_axes(self):
        return [self._convert(x) for x in self._acc_sensor.read_i2c_block_data(self._acc_sensor_address, DATA_REGISTER_START, 3)]

    def _detect_marker(self):
        if self._tacho_prev_time < 0:
            self._tacho_prev_time = time.time()
            return
        
        current_time = time.time()
        rotation_freq = 1 / (current_time - self._tacho_prev_time)
        self._tacho_prev_time = current_time

        self._data_pipe.send([rotation_freq, current_time, 'freq'])

        
    def run(self):
        while True:
            start_time = time.time()
            data = self._read_axes()
            data.append(start_time)
            data.append('acc')
            self._data_pipe.send(data)

            sleep_time = 0.001 - time.time() - start_time
            if sleep_time > 0:
                time.sleep(sleep_time)
