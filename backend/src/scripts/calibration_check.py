import sys
import json
import numpy as np


input_data = sys.stdin.readlines()
data = json.loads(input_data[0])

x = np.array(data["x"])
y = np.array(data["y"])
z = np.array(data["z"])

processedData = {"x": np.mean(x), "y": np.mean(y), "z": np.mean(z)}

print(json.dumps(processedData))
sys.stdout.flush()
