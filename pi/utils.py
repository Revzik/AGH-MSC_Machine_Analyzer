from typing import Tuple
import json


PUB_RAW = "sensor/data/raw"
PUB_DATA = "sensor/data/processed"
PUB_CALIBRATION = "sensor/calibration/data"

SUB_ACQUISITION = "sensor/acquisition"
SUB_CALIBRATION = "sensor/calibration/control"
SUB_CONFIG = "sensor/config"

ACC_TAG = 'acc'
FREQ_TAG = 'freq'


def pack(topic: str, data: dict, qos: int) -> dict:
    return {
        "topic": topic,
        "data": json.dumps(data),
        "qos": qos
    }

def unpack(msg: dict) -> Tuple[str, str, int]:
    return (msg["topic"], msg["data"], msg["qos"])
