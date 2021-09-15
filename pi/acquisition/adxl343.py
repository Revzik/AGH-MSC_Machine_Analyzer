from utils.topics import ACC_TAG
import time
import os
import spidev


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


# Initialize the bus

spi = spidev.SpiDev()
spi.open(SPI_BUS, SPI_CE)
spi.max_speed_hz = CLK_SPEED
spi.mode = 3


# Helper functions

def get_bw_rate(fs):
    if fs <= 25:
        return [BW_RATE_25, 25]
    elif fs <= 50:
        return [BW_RATE_50, 50]
    elif fs <= 100:
        return [BW_RATE_100, 100]
    elif fs <= 200:
        return [BW_RATE_200, 200]
    elif fs <= 400:
        return [BW_RATE_400, 400]
    elif fs <= 800:
        return [BW_RATE_800, 800]
    elif fs <= 1600:
        return [BW_RATE_1600, 1600]
    else:
        return [BW_RATE_3200, 3200]

def get_data_format(range):
    if range <= 2:
        return DATA_FORMAT_2G
    elif range <= 4:
        return DATA_FORMAT_4G
    elif range <= 8:
        return DATA_FORMAT_8G
    else:
        return DATA_FORMAT_16G


# Sensor setup

def setup_sensor(bw_rate, data_format):
    print("Setting up sensor registers...")

    spi.writebytes([POWER_CTL_REG, POWER_CTL_OFF])
    spi.writebytes([DATA_REG, data_format])
    spi.writebytes([BW_RATE_REG, bw_rate])
    spi.writebytes([INT_ENABLE_REG, INT_ENABLE_ALL_OFF])
    spi.writebytes([FIFO_CTL_REG, FIFO_CTL_BYPASS])
    spi.writebytes([POWER_CTL_REG, POWER_CTL_ON])

    print("Registers set!")
    print("Starting sensor capture")

def stop_sensor():
    print("Stopping sensor capture")
    print("Clearing up sensor registers...")

    spi.writebytes([POWER_CTL_REG, POWER_CTL_OFF])
    spi.writebytes([INT_ENABLE_REG, INT_ENABLE_ALL_OFF])
    spi.writebytes([FIFO_CTL_REG, FIFO_CTL_BYPASS])

    print("Registers set!")


# Acquisition

def read_acc():
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

    return [x, y, z]


# Thread acquisition subclass

def do_acquisition(stop_event, queue, fs, range):
    print("Initializing ADXL343 sensor...")

    bw_rate, fs = get_bw_rate(fs)
    data_format = get_data_format(range)

    setup_sensor(bw_rate, data_format)

    print("Sensor initialized!")

    while not stop_event.is_set():
        data_time = time.time()
        data = read_acc()

        data.append(data_time)
        data.append(ACC_TAG)

        queue.put(data)
        
        sleep_time = time.time() - data_time
        if sleep_time > 0:
            time.sleep(sleep_time)

    print("Stopping ADXL343 sensor")
    stop_sensor()
