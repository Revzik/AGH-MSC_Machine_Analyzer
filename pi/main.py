#!/home/pi/berryconda3/bin/python

from dotenv import load_dotenv
load_dotenv()


from paho.mqtt import client as mqtt
import os
from utils import *
from manager import Manager
from multiprocessing import Pipe

    
# Process manager

publish_out, publish_in = Pipe()
manager = Manager(publish_in)


# Client functions

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(SUB_ACQUISITION, qos=2)
    client.subscribe(SUB_CALIBRATION, qos=2)
    client.subscribe(SUB_CONFIG, qos=2)
    print("Subscribed to topics: {}".format([SUB_ACQUISITION, SUB_CALIBRATION, SUB_CONFIG]))

def on_message(client, userdata, msg):
    topic = msg.topic
    message = msg.payload.decode("ascii")
    print("Message received. Topic: {}, Payload: {}".format(topic, message))
    manager.process_action(topic, message)
    

# Configuring the client

print("Creating MQTT client")
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.username_pw_set(
    os.getenv("MQTT_USER"), os.getenv("MQTT_PASSWORD")
)
print("Connecting MQTT client")
client.connect(
    os.getenv("MQTT_URL"), port=int(os.getenv("MQTT_PORT")), keepalive=60
)
client.loop_start()

try:
    while True:
        topic, data, qos = unpack(publish_out.recv())
        client.publish(topic, data, qos)
except KeyboardInterrupt:
    client.loop_stop()
    manager.stop_processing()
