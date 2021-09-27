from typing import List, Tuple
import time
import os
import numpy as np
from gpiozero import DigitalInputDevice
from multiprocessing import Event, Queue, Process
from spidev import SpiDev


# Tacho pin

TACHO_GPIO = int(os.getenv("TACHO_GPIO"))


# Sensor addresses and interrupt pin

SPI_BUS = int(os.getenv("SENSOR_SPI_BUS"))
SPI_CE = int(os.getenv("SENSOR_SPI_CE_PIN"))


# SPI CLK speed and transfer delay

CLK_SPEED = 5000000     # 3200 Hz sampling frequency requires 2-5 MHz 
XFER_DELAY = 5          # For correct readings ADXL343 requires 5 us breaks


# ADXL register settings

DATA_REG = 0x32

DATA_FORMAT_REG = 0x31
DATA_FORMAT_16G = 0b00001011
DATA_FORMAT_8G  = 0b00001010
DATA_FORMAT_4G  = 0b00001001
DATA_FORMAT_2G  = 0b00001000

BW_RATE_REG  = 0x2c
BW_RATE_3200 = 0b00001111
BW_RATE_1600 = 0b00001110
BW_RATE_800  = 0b00001101
BW_RATE_400  = 0b00001100
BW_RATE_200  = 0b00001011
BW_RATE_100  = 0b00001010
BW_RATE_50   = 0b00001001
BW_RATE_25   = 0b00001000

POWER_CTL_REG = 0x2d
POWER_CTL_ON  = 0b00001000
POWER_CTL_OFF = 0b00000100

INT_ENABLE_REG        = 0x2e
INT_ENABLE_ALL_OFF    = 0b00000000

FIFO_CTL_REG    = 0x38
FIFO_CTL_BYPASS = 0b00000000


# Helper functions

def get_bw_rate(fs: int) -> Tuple[int, int]:
    if fs == 25:
        return (BW_RATE_25, 25)
    elif fs == 50:
        return (BW_RATE_50, 50)
    elif fs == 100:
        return (BW_RATE_100, 100)
    elif fs == 200:
        return (BW_RATE_200, 200)
    elif fs == 400:
        return (BW_RATE_400, 400)
    elif fs == 800:
        return (BW_RATE_800, 800)
    elif fs == 1600:
        return (BW_RATE_1600, 1600)
    elif fs == 3200:
        return (BW_RATE_3200, 3200)
    else:
        raise ValueError("fs must be 25, 50, 100, 200, 400, 800, 1600 or 3200")

def get_data_format(range: int) -> int:
    if range == 2:
        return DATA_FORMAT_2G
    elif range == 4:
        return DATA_FORMAT_4G
    elif range == 8:
        return DATA_FORMAT_8G
    elif range == 16:
        return DATA_FORMAT_16G
    else:
        raise ValueError("range must be 2, 4, 8 or 16")


class Sensor(Process):
    def __init__(self, queue: Queue, stop_event: Event, fs: int, range: int) -> None:
        super(Sensor, self).__init__()

        self.spi: SpiDev = SpiDev()
        self.spi.open(SPI_BUS, SPI_CE)
        self.spi.max_speed_hz = CLK_SPEED
        self.spi.mode = 3

        bw_rate, fs = get_bw_rate(fs)
        self.bw_rate: int = bw_rate
        self.fs: int = fs
        self.data_format: int = get_data_format(range)

        self.queue: Queue = queue
        self.stop_event: Event = stop_event

    def run(self) -> None:
        self.setup_sensor()

        while not self.stop_event.is_set():
            data_time = time.time()

            self.queue.put(self.read_acc(data_time))
            
            sleep_time = time.time() - data_time
            if sleep_time > 0:
                time.sleep(sleep_time)

        self.stop_sensor()
        
    def read_acc(self, timestamp: float) -> List[float]:
        addr = DATA_REG + 0x80 + 0x40
        msg = [addr, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        data = self.spi.xfer(msg, CLK_SPEED, XFER_DELAY)

        x = ((data[2] & 31) << 8) | data[1]
        y = ((data[4] & 31) << 8) | data[3]
        z = ((data[6] & 31) << 8) | data[5]

        if x >= 4096:
            x -= 8192
        if y >= 4096:
            y -= 8192
        if z >= 4096:
            z -= 8192

        return [x, y, z, timestamp]
        
    def setup_sensor(self) -> None:
        print("Setting up sensor registers...")

        self.spi.writebytes([POWER_CTL_REG, POWER_CTL_OFF])
        self.spi.writebytes([DATA_REG, self.data_format])
        self.spi.writebytes([BW_RATE_REG, self.bw_rate])
        self.spi.writebytes([INT_ENABLE_REG, INT_ENABLE_ALL_OFF])
        self.spi.writebytes([FIFO_CTL_REG, FIFO_CTL_BYPASS])
        self.spi.writebytes([POWER_CTL_REG, POWER_CTL_ON])

        print("Registers set!")
        print("Starting sensor capture")

    def stop_sensor(self) -> None:
        print("Stopping sensor capture")
        print("Clearing up sensor registers...")

        self.spi.writebytes([POWER_CTL_REG, POWER_CTL_OFF])
        self.spi.writebytes([INT_ENABLE_REG, INT_ENABLE_ALL_OFF])
        self.spi.writebytes([FIFO_CTL_REG, FIFO_CTL_BYPASS])
        self.spi.close()

        print("Registers set!")


class Tacho:
    def __init__(self, queue: Queue) -> None:
        print("Initializing tachometer...")
        self.queue: Queue = queue

        self.tacho: DigitalInputDevice = DigitalInputDevice(TACHO_GPIO)
        self.tacho_prev_time: float = -1.0

        print("Tachometer initialized!")

    def start(self) -> None:
        print("Starting tachometer")
        self.tacho.when_activated = self.get_data

    def stop(self) -> None:
        print("Stopping tachometer")
        self.tacho.when_activated = None

    def is_running(self) -> bool:
        return self.tacho.when_activated is not None

    def get_data(self) -> None:
        if self.tacho_prev_time < 0:
            self.tacho_prev_time = time.time()
            return
        
        current_time = time.time()
        rotation_freq = 1 / (current_time - self.tacho_prev_time)
        self.tacho_prev_time = current_time

        self.queue.put([current_time, rotation_freq])
