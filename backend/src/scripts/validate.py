import numpy as np
import json
import sys


# Loading and parsing data

input_data = sys.stdin.readlines()
input_data = json.loads(input_data[0])
data = input_data["data"]
thresholds = input_data["thresholds"]


# Helper functions


def check_above(value, high):
    return True if high is None else bool(value < high)


def check_between(value, low, high):
    if low is not None and value <= low:
        return False
    if high is not None and value >= high:
        return False
    return True


def validate_orders(x_spectrum, y_spectrum, z_spectrum, orders, order_thresholds):
    validated_orders = []
    for item in order_thresholds:
        x_value = np.interp(item["order"], orders, x_spectrum)
        y_value = np.interp(item["order"], orders, y_spectrum)
        z_value = np.interp(item["order"], orders, z_spectrum)
        validated_orders.append(
            {
                "order": item["order"],
                "x": {"value": x_value, "valid": check_above(x_value, item["x"])},
                "y": {"value": y_value, "valid": check_above(y_value, item["x"])},
                "z": {"value": z_value, "valid": check_above(z_value, item["x"])},
            }
        )

    return validated_orders


# Computation

validated = {
    "x": {
        "rms": check_above(data["x"]["rms"], thresholds["x"]["rms"]),
        "peak": check_above(data["x"]["peak"], thresholds["x"]["peak"]),
        "kurtosis": check_between(
            data["x"]["kurtosis"],
            thresholds["x"]["kurtosis"]["min"],
            thresholds["x"]["kurtosis"]["max"],
        ),
        "crestFactor": check_between(
            data["x"]["crestFactor"],
            thresholds["x"]["crestFactor"]["min"],
            thresholds["x"]["crestFactor"]["max"],
        ),
    },
    "y": {
        "rms": check_above(data["y"]["rms"], thresholds["y"]["rms"]),
        "peak": check_above(data["y"]["peak"], thresholds["y"]["peak"]),
        "kurtosis": check_between(
            data["y"]["kurtosis"],
            thresholds["y"]["kurtosis"]["min"],
            thresholds["y"]["kurtosis"]["max"],
        ),
        "crestFactor": check_between(
            data["y"]["crestFactor"],
            thresholds["y"]["crestFactor"]["min"],
            thresholds["y"]["crestFactor"]["max"],
        ),
    },
    "z": {
        "rms": check_above(data["z"]["rms"], thresholds["z"]["rms"]),
        "peak": check_above(data["z"]["peak"], thresholds["z"]["peak"]),
        "kurtosis": check_between(
            data["z"]["kurtosis"],
            thresholds["z"]["kurtosis"]["min"],
            thresholds["z"]["kurtosis"]["max"],
        ),
        "crestFactor": check_between(
            data["z"]["crestFactor"],
            thresholds["z"]["crestFactor"]["min"],
            thresholds["z"]["crestFactor"]["max"],
        ),
    },
    "orders": validate_orders(
        data["x"]["orderSpectrum"],
        data["y"]["orderSpectrum"],
        data["z"]["orderSpectrum"],
        data["orders"],
        thresholds["orderSpectrum"],
    ),
}

print(json.dumps(validated))
sys.stdout.flush()
