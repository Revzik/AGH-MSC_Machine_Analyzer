from multiprocessing.queues import Queue
from acquisitor import Sensor
from dotenv import load_dotenv
from paho.mqtt import client as mqtt
import os
import json
from processor import Processor
from calibrator import Calibrator
import numpy as np

SUB_ACQUISITION = "sensor/acquisition"
SUB_CALIBRATION = "sensor/calibration/new"
SUB_CONFIG = "sensor/config"

load_dotenv()

print("Starting data acquisitor")


print("Creating MQTT client")
client = mqtt.Client()

# Data processor / calibrator data

data_processor = None
sensor = None
config = {
    "lowpass": 250,
    "range": 4,
    "dOrder": 0.1,
    "maxOrder": 10,
    "windowLength": 200,
    "windowOverlap": 50,
    "tachoPoints": 1,
    "averages": 10
}
calibration = np.ones((3, 1))

def stop_processor():
    global data_processor, sensor

    if sensor is not None:
        sensor.terminate()
        sensor = None
    if data_processor is not None:
        data_processor.terminate()
        data_processor = None

def start_processor():
    global data_processor, sensor, config, calibration

    print("Creating processes")
    print("Creating queue")
    data_queue = Queue()
    print("Creating sensor")
    sensor = Sensor(data_queue)
    print("Creating processor")
    data_processor = Processor(client.publish, sensor, data_queue, config, calibration)
    
    print("Starting processes")
    sensor.start()
    data_processor.start()

def start_calibrator():
    global data_processor, sensor

    print("Creating processes")
    data_queue = Queue()
    sensor = Sensor(data_queue)
    data_processor = Calibrator(client.publish, sensor, data_queue)
    
    print("Starting processes")
    sensor.start()
    data_processor.start()

def process_acquisition(message):
    global data_processor, client

    if message == "start":
        start_processor()
    elif message == "stop":
        stop_processor()
        

def process_calibration(message):
    global data_processor, client, config
    
    if message == "start_simple":
        start_calibrator()
    elif message == "stop":
        stop_processor()
    elif message.startswith("{"):
        config = json.dumps(message)

# Client functions

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(SUB_ACQUISITION, qos=2)
    client.subscribe(SUB_CALIBRATION, qos=2)
    client.subscribe(SUB_CONFIG, qos=2)
    print("Subscribed to topics: {}".format(['sensor/acquisition', 'sensor/calibration/control', 'sensor/config']))

def on_message(client, userdata, msg):
    print("Message received. Topic: {}, Payload: {}".format(msg.topic, msg.payload.decode("ascii")))
    if msg.topic == SUB_ACQUISITION:
        process_acquisition(msg.payload.decode("ascii"))
    elif msg.topic == SUB_CALIBRATION:
        process_calibration(msg.payload.decode("ascii"))

# Configuring the client

client.on_connect = on_connect
client.on_message = on_message
client.username_pw_set(
    os.getenv("MQTT_USER"), os.getenv("MQTT_PASSWORD")
)
print("Connecting MQTT client")
client.connect(
    os.getenv("MQTT_URL"), port=int(os.getenv("MQTT_PORT")), keepalive=60
)

try:
    client.loop_forever()
except KeyboardInterrupt:
    stop_processor()
