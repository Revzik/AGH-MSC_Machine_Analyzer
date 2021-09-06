from dotenv import load_dotenv
from paho.mqtt import client as mqtt
import os
from processor import Processor

load_dotenv()

print("Starting data acquisitor")

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe('sensor/acquisition', qos=2)
    client.subscribe('sensor/calibration/control', qos=2)
    client.subscribe('sensor/config', qos=2)
    print("Subscribed to topics: {}".format(['sensor/acquisition', 'sensor/calibration/control', 'sensor/config']))

def on_message(client, userdata, msg):
    print("Message received. Topic: {}, Payload: {}".format(msg.topic, msg.payload.decode("ascii")))

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

print("Starting data processor")
processor = Processor(client.publish)
processor.start()

try:
    client.loop_forever()
except KeyboardInterrupt:
    processor.join()
