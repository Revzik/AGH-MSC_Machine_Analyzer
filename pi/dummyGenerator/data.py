import numpy as np
from threading import Thread
import time


class DummyGenerator():
    def __init__(self):
        self._initialized = False
        self._delay = None
        self._sendDataCallback = None

        self._config = {
            "lowpass": 250,
            "range": 4,
            "dOrder": 0.1,
            "maxOrder": 10,
            "windowLength": 200,
            "windowOverlap": 50,
            "tachoPoints": 1,
            "averages": 10,
        }
        
        self._thread = None
        self.is_running = False

    def init(self, sendDataCallback, delay=5.0):
        self._delay = delay
        self._sendDataCallback = sendDataCallback
        self._initialized = True

    def isInitialized(self):
        return self._initialized and self._sendDataCallback is not None

    def start(self):
        if not self._initialized:
            print("The generator is not yet initialized")
            raise Exception("DummyGenerator is not initialized")

        if self.is_running:
            print("The thread is already running")
            return

        print("Starting data generation in {} seconds".format(self._delay))
        self.is_running = True
        self._thread = Thread(target=self._sendData)
        self._thread.start()

    def stop(self):
        if self.is_running:
            print("Stopping data generation")
            self.is_running = False
            self._thread.join()

    def setConfig(self, config):
        self._config = config

    def setState(self, state):
        self.state = state

    def _sendData(self):
        time.sleep(self._delay)
        while self.is_running:
            print("Generating data...")
            startTime = time.time()
            config_snapshot = self._config
            interval = max(
                0.0,
                (
                    self._getInterval(config_snapshot)
                    - (time.time() - startTime)
                )
            )
            self._sendDataCallback(self._generateData(config_snapshot))
            print("Executing next in {}".format(interval))
            time.sleep(interval)

    def _getInterval(self, config):
        wL = config["windowLength"]
        ovlap = config["windowOverlap"] / 100
        avg = config["averages"]
        return wL * (1 + (avg - 1) * (1 - ovlap)) / 1000

    def _generateData(self, config):
        frequency = 40 + 3 * np.random.randn()
        rms = 2 + 0.5 * np.random.randn()
        kurtosis = 3 + 0.2 * np.random.randn()
        peak_factor = 1.5 + 0.2 * np.random.randn()
        order0 = 0

        x = np.arange(
            order0,
            config["maxOrder"] + config["dOrder"],
            config["dOrder"],
        )
        xp = np.arange(0, 11, 0.25)
        fp_mu = 0.05 * np.ones(44)
        np.put(
            fp_mu,
            [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
            [0, 2, 0.5, 0.3, 1.4, 0.3, 0.2, 0.1, 0.2, 0.1, 0.3],
        )
        fp_sigma = 0.02 * np.ones(44)
        np.put(
            fp_sigma,
            [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
            [0, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        )
        fp = np.abs(fp_mu + fp_sigma * np.random.randn(44))
        spectrum = np.interp(x, xp, fp)

        return {
            "frequency": frequency,
            "rms": rms,
            "kurtosis": kurtosis,
            "peakFactor": peak_factor,
            "orderSpectrum": {
                "order0": order0,
                "dOrder": config["dOrder"],
                "spectrum": spectrum.tolist(),
            },
        }
