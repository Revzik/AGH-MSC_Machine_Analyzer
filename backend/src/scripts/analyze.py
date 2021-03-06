import sys
import json
import numpy as np
import scipy.stats as stat


# Loading and parsing data

input_data = sys.stdin.readlines()
input_data = json.loads(input_data[0])
config = input_data["config"]
data = input_data["data"]
cal = input_data["cal"]

win_len_s = config["windowLength"] / 1000
win_len = int(config["fs"] * win_len_s)
win_step = int(win_len * (100 - config["windowOverlap"]) / 100)

x = (np.array(data["x"]) + cal["offset"]["x"]) * cal["sensitivity"]["x"]
y = (np.array(data["y"]) + cal["offset"]["y"]) * cal["sensitivity"]["y"]
z = (np.array(data["z"]) + cal["offset"]["z"]) * cal["sensitivity"]["z"]
t = np.linspace(
    data["t0"], data["t0"] + data["dt"] * data["nt"], data["nt"], endpoint=False
)
acc = np.vstack((x, y, z))
f = np.array(data["f"])
ft = np.array(data["ft"])


# Preprocessing

n_windows = config["averages"]
if n_windows > 1:
    n_windows -= 1
    acc = acc[:, win_step::]
    t = t[win_step::]

acc = acc - np.mean(acc, axis=1).reshape(3, 1)


# Computing statistical parameters

f_avg = 0
if f.size > 0:
    f_avg = np.mean(f)

rms = np.sqrt(np.mean(np.square(acc), axis=1))
peak = np.max(np.abs(acc), axis=1)
kurtosis = stat.kurtosis(acc, axis=1)
crest = peak / rms


# Order analysis

n_orders = int(config["maxOrder"] / config["dOrder"]) + 1
orders = np.linspace(0, config["maxOrder"], n_orders)
spec = np.zeros((3, n_orders))

if f.size > 0:

    t_kern = np.linspace(0, win_len_s, win_len, endpoint=False)
    f_interp = np.interp(t, ft, f)
    window = np.hanning(win_len).reshape(win_len)
    window = window / np.mean(window)

    j = 0
    for i in range(n_windows):
        kernel = (
            np.exp(2j * np.pi * np.outer(orders, f_interp[j : j + win_len] * t_kern))
            * window
        )
        spec += np.abs(kernel.dot(acc[:, j : j + win_len].T)).T / win_len
        j += win_step

    spec = spec / n_windows


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
