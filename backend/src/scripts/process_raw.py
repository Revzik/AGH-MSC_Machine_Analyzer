import sys
import json
import numpy as np


input_data = sys.stdin.readlines()
input_data = json.loads(input_data[0])

data = input_data["data"]
cal = input_data["cal"]

x = (np.array(data["x"]) + cal["offset"]["x"]) * cal["sensitivity"]["x"]
y = (np.array(data["y"]) + cal["offset"]["y"]) * cal["sensitivity"]["y"]
z = (np.array(data["z"]) + cal["offset"]["z"]) * cal["sensitivity"]["z"]
t = np.linspace(data["t0"], data["t0"] + data["nt"] * data["dt"], data["nt"])

processedData = {
    "t0": data["t0"],
    "dt": data["dt"],
    "nt": data["nt"],
    "t": t.tolist(),
    "x": x.tolist(),
    "y": y.tolist(),
    "z": z.tolist(),
    "f": data["f"],
    "ft": data["ft"],
}

print(json.dumps(processedData))
sys.stdout.flush()