import numpy as np
from pysingleton import PySingleton
from threading import Timer


class DummyGenerator(metaclass=PySingleton):
    def __init__(self):
        self._initialized = False
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
        self._acquiring = False
        self._timer = None
        self.is_running = False

    def init(self, sendDataCallback):
        self._sendDataCallback = sendDataCallback
        self._initialized = True

    def isInitialized(self):
        return self._initialized and self._sendDataCallback is not None

    def start(self):
        if not self.isRunning:
            self._timer = Timer(self._getInterval(), self._sendData)
            self._timer.start()
            self.is_running = True

    def stop(self):
        self._timer.cancel()
        self.is_running

    def setConfig(self, config):
        self._config = config

    def setState(self, state):
        self.state = state

    def _sendData(self):
        print(self._generateData())

    def _getInterval(self):
        wL = self._config["windowLength"]
        ovlap = self._config["windowOverlap"] / 100
        avg = self._config["averages"]
        return wL * (1 + (avg - 1) * (1 - ovlap)) / 1000

    def _generateData(self):
        frequency = 40 + 3 * np.random.randn()
        rms = 2 + 0.5 * np.random.randn()
        kurtosis = 3 + 0.2 * np.random.randn()
        peak_factor = 1.5 + 0.2 * np.random.randn()
        order0 = 0

        x = np.arange(
            order0,
            self._config["maxOrder"] + self._config["dOrder"],
            self._config["dOrder"],
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
                "dOrder": self._config["dOrder"],
                "spectrum": spectrum,
            },
        }
