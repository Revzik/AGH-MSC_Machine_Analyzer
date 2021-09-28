from typing import Tuple
import time
import os
import json
from gpiozero import DigitalInputDevice
from threading import Event, Thread
from spidev import SpiDev
from topics import PUB_DATA


# Tacho pin

TACHO_GPIO = int(os.getenv("TACHO_GPIO"))


# Sensor addresses and interrupt pin

SPI_BUS = int(os.getenv("SENSOR_SPI_BUS"))
SPI_CE = int(os.getenv("SENSOR_SPI_CE_PIN"))
SPI_INT_GPIO = int(os.getenv("SENSOR_INT_GPIO"))


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
INT_ENABLE_DATA_READY = 0b10000000

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

def get_buffer_length(fs: int, win_len: int, win_ovlap: int, n: int):
    win_len = int(fs * win_len / 1000)
    win_step = int(win_len * (100 - win_ovlap) / 100)
    
    return (n - 1) * win_step + win_len


# Interfaces

spi = SpiDev()
spi.open(SPI_BUS, SPI_CE)
spi.max_speed_hz = CLK_SPEED
spi.mode = 3
int_pin = DigitalInputDevice(SPI_INT_GPIO, pull_up=None, active_state=True)

tacho_pin = DigitalInputDevice(TACHO_GPIO)


class Sensor(Thread):
    def __init__(self, publish, stop_event: Event, fs: int, range: int, win_len: int, win_ovlap: int, n_averages: int) -> None:
        super(Sensor, self).__init__()
        print("Initializing sensor")

        bw_rate, fs = get_bw_rate(fs)
        self.bw_rate: int = bw_rate
        self.fs: int = fs
        self.data_format: int = get_data_format(range)

        self.tacho_prev_time = -1

        self.buffer_len: int = fs
        self.buffer_idx: int= 0
        self.t0 = -1.0
        self.x = [0] * self.buffer_len
        self.y = [0] * self.buffer_len
        self.z = [0] * self.buffer_len
        self.f = []
        self.ft = []
 
        self.publish: function = publish
        self.stop_event: Event = stop_event

    def run(self) -> None:
        self.setup_sensor()

        while not self.stop_event.is_set():
            int_pin.wait_for_active()
            if self.t0 < 0:
                self.t0 = time.time_ns()
            
            self.read_acc()

            self.buffer_idx += 1
            if self.buffer_idx == self.buffer_len:
                data = {
                    "t0": self.t0,
                    "x": self.x,
                    "y": self.y,
                    "z": self.z,
                    "f": self.f,
                    "ft": self.ft
                }
                self.publish(PUB_DATA, json.dumps(data), 0)

                self.buffer_idx = 0
                self.reset_buffers()
                
        self.stop_sensor()

    def read_freq(self) -> None:
        if self.tacho_prev_time < 0:
            self.tacho_prev_time = time.time()
            return
        
        current_time = time.time()
        freq = 1 / (current_time - self.tacho_prev_time)
        self.tacho_prev_time = current_time

        self.f.append(freq)
        self.ft.append(current_time)
        
    def read_acc(self) -> None:
        addr = DATA_REG + 0x80 + 0x40
        msg = [addr, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        data = spi.xfer(msg, CLK_SPEED, XFER_DELAY)

        x = ((data[2] & 31) << 8) | data[1]
        y = ((data[4] & 31) << 8) | data[3]
        z = ((data[6] & 31) << 8) | data[5]

        if x >= 4096:
            x -= 8192
        if y >= 4096:
            y -= 8192
        if z >= 4096:
            z -= 8192
            
        self.x[self.buffer_idx] = x
        self.y[self.buffer_idx] = y
        self.z[self.buffer_idx] = z
        
    def setup_sensor(self) -> None:
        print("Setting up sensor registers...")

        spi.writebytes([POWER_CTL_REG, POWER_CTL_OFF])
        spi.writebytes([DATA_REG, self.data_format])
        spi.writebytes([BW_RATE_REG, self.bw_rate])
        spi.writebytes([INT_ENABLE_REG, INT_ENABLE_DATA_READY])
        spi.writebytes([FIFO_CTL_REG, FIFO_CTL_BYPASS])
        spi.writebytes([POWER_CTL_REG, POWER_CTL_ON])

        print("Registers set!")

        print("Starting sensor capture")
        tacho_pin.when_activated = self.read_freq

    def stop_sensor(self) -> None:
        print("Stopping sensor capture")
        tacho_pin.when_activated = None

        print("Clearing up sensor registers...")

        spi.writebytes([POWER_CTL_REG, POWER_CTL_OFF])
        spi.writebytes([INT_ENABLE_REG, INT_ENABLE_ALL_OFF])
        spi.writebytes([FIFO_CTL_REG, FIFO_CTL_BYPASS])

        print("Registers set!")

    def reset_buffers(self):
        self.t0 = -1
        self.x = [0] * self.buffer_len
        self.y = [0] * self.buffer_len
        self.z = [0] * self.buffer_len
        self.f = []
        self.ft = []