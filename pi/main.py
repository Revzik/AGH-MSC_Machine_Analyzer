#!/usr/bin/python

from dotenv import load_dotenv
load_dotenv()


from paho.mqtt import client as mqtt
import os
import json
from topics import *
from sensors import Sensor
from threading import Event


# Sensor config
stop_event: Event = Event()
sensor: Sensor = None


# Client functions

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(SUB_CONFIG, qos=2)
    print("Subscribed to topics: {}".format([SUB_CONFIG]))

def on_message(client, userdata, msg):
    topic = msg.topic
    message = msg.payload.decode("ascii")
    print("Message received. Topic: {}, Payload: {}".format(topic, message))
    
    if topic == SUB_CONFIG:
        global sensor, stop_event

        config = json.loads(message)

        stop_event.set()
        if sensor is not None:
            sensor.join()
        stop_event.clear()
        sensor = Sensor(client.publish, stop_event, config["fs"], config["range"], config["windowLength"], config["windowOverlap"], config["averages"])
        sensor.start()


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

try:
    client.loop_forever()
except KeyboardInterrupt:
    stop_event.set()
    if sensor is not None:
        sensor.join()
