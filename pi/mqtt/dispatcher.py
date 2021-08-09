import os
from paho.mqtt import client as mqtt
from pysingleton import PySingleton
import json

# TODO: Add subscribers / publishers, connect them to the generator
TOPIC_SENSOR = "sensor"
TOPIC_ACQUISITION = TOPIC_SENSOR + "/acquisition"
TOPIC_CONFIG = TOPIC_SENSOR + "/config"
TOPIC_DATA = TOPIC_SENSOR + "/data"

class Dispatcher(metaclass=PySingleton):
    def __init__(self, generator):
        self._generator = generator
        self._generator.init(self.publish)

        self._client = mqtt.Client()
        self._client.on_connect = self.on_connect
        self._client.on_message = self.on_message
        self._client.username_pw_set(
            os.getenv("MQTT_USER"), password=os.getenv("MQTT_PASSWORD")
        )
        self._client.connect(
            os.getenv("MQTT_URL"), port=int(os.getenv("MQTT_PORT")), keepalive=60
        )

    def on_connect(self, client, userdata, flags, rc):
        print("Connected with result code " + str(rc))
        client.subscribe(TOPIC_ACQUISITION, qos=2)
        client.subscribe(TOPIC_CONFIG, qos=2)
        print("Subscribed to topics: {}".format([TOPIC_ACQUISITION, TOPIC_CONFIG]))

    def on_message(self, client, userdata, msg):
        if msg.topic == TOPIC_ACQUISITION:
            self.process_acquisition(msg.payload)
        elif msg.topic == TOPIC_CONFIG:
            self.process_config(msg.payload)
            
    def process_acquisition(self, msg):
        if msg == "start":
            self._generator.start()
        elif msg == "stop":
            self._generator.stop()
            
    def process_config(self, msg):
        self._generator.setConfig(json.loads(msg))

    def start(self):
        self._client.loop_start()

    def stop(self):
        self._client.loop_stop()

    def publish(self, message):
        self._client.publish(TOPIC_DATA, json.dumps(message), qos=0)

    def start_generator(self):
        self._generator.start()

    def stop_generator(self):
        self._generator.stop()
