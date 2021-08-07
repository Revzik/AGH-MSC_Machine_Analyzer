import os
from paho.mqtt import client as mqtt

# TODO: Add subscribers / publishers, connect them to the generator
# TODO: Move it to a separate thread

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("$SYS/#")


def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(os.getenv("MQTT_URL"), port=int(os.getenv("MQTT_PORT")), keepalive=60)

client.loop_forever()
