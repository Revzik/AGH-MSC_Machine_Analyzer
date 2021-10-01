import sys
import json


input_data = sys.stdin.readlines()
data = json.loads(input_data[0])

G = 9.81

x1 = data["x1"]
y1 = data["y1"]
z1 = data["z1"]
x0 = (data["x0y"] + data["x0z"]) / 2
y0 = (data["y0x"] + data["y0z"]) / 2
z0 = (data["z0x"] + data["z0y"]) / 2

sensitivity = {"x": G / (x1 - x0), "y": G / (y1 - y0), "z": G / (z1 - z0)}
offset = {"x": -x0, "y": -y0, "z": -z0}

processedData = {"sensitivity": sensitivity, "offset": offset}

print(json.dumps(processedData))
sys.stdout.flush()
