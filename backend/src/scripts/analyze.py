import sys
import json
import numpy as np
import scipy.signal as sig
import scipy.stats as stat


# Loading and parsing data

input_data = sys.stdin.readlines()
input_data = json.loads(input_data[0])
config = input_data["config"]
data = input_data["data"]

win_len_s = config["windowLength"] / 1000
win_len = int(config["fs"] * win_len_s)
win_step = int(win_len * (100 - config["windowOverlap"]) / 100)

x = np.array(data["x"])
y = np.array(data["y"])
z = np.array(data["z"])
t = np.linspace(data["t0"], data["t0"] + data["dt"] * data["nt"], data["nt"], endpoint=False)
acc = np.vstack((x, y, z))
f = np.array(data["f"])
ft = np.array(data["ft"])


# Preprocessing

acc = acc - np.mean(acc, axis=1).reshape(3, 1)

b, a = sig.butter(27, 0.8, btype="low", analog=False)
acc = sig.lfilter(b, a, acc, axis=1)


# Computing statistical parameters

f_avg = np.mean(f)

rms = np.sqrt(np.mean(np.square(acc), axis=1))
peak = np.max(np.abs(acc), axis=1)
kurtosis = stat.kurtosis(acc, axis=1)
crest = peak / rms


# Order analysis

n_orders = int(config["maxOrder"] / config["dOrder"])
orders = np.linspace(0, config["maxOrder"], n_orders, endpoint=False)
t_kern = np.linspace(0, win_len_s, win_len, endpoint=False)
f_interp = np.interp(t, ft, f)

spec = np.zeros((3, n_orders))

j = 0
for i in range(config["averages"]):
    kernel = np.exp(2j * np.pi * np.outer(orders, f_interp[j : j + win_len] * t_kern))
    spec += np.abs(kernel.dot(acc[:, j : j + win_len].T)).T / win_len
    j += win_step

spec = spec / config["averages"]


# Parsing and sending output data

processedData = {
    "f": f_avg,
    "x": {
        "rms": rms[0],
        "peak": peak[0],
        "kurtosis": kurtosis[0],
        "crestFactor": crest[0],
        "orderSpectrum": spec[0, :].tolist(),
    },
    "y": {
        "rms": rms[1],
        "peak": peak[1],
        "kurtosis": kurtosis[1],
        "crestFactor": crest[1],
        "orderSpectrum": spec[1, :].tolist(),
    },
    "z": {
        "rms": rms[2],
        "peak": peak[2],
        "kurtosis": kurtosis[2],
        "crestFactor": crest[2],
        "orderSpectrum": spec[2, :].tolist(),
    },
    "orders": orders.tolist(),
}

print(json.dumps(processedData))
sys.stdout.flush()