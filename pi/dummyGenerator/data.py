import numpy as np

class DummyGenerator:
  def __init__(self) -> None:
    self.config = { 'lowpass': 250, 
                    'range': 4, 
                    'dOrder': 0.1, 
                    'maxOrder': 10, 
                    'windowLength': 200, 
                    'windowOverlap': 50, 
                    'tachoPoints': 1, 
                    'averages': 10 }
    self.state = { 'acquiring': False, 
                   'capturing': False }

  def setConfig(self, config):
    self.config = config

  def setState(self, state):
    self.state = state

  def generateData(self):
    frequency = 40 + 3 * np.random.randn()
    rms = 2 + 0.5 * np.random.randn()
    kurtosis = 3 + 0.2 * np.random.randn()
    peakFactor = 1.5 + 0.2 * np.random.randn()
    order0 = 0

    x = np.arange(order0, self.config['maxOrder'] + self.config['dOrder'], self.config['dOrder'])
    xp = np.arange(0, 11, 0.25)
    fp_mu = 0.05 * np.ones(44)
    np.put(fp_mu, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [0, 2, 0.5, 0.3, 1.4, 0.3, 0.2, 0.1, 0.2, 0.1, 0.3])
    fp_sigma = 0.02 * np.ones(44)
    np.put(fp_sigma, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [0, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1])
    fp = np.abs(fp_mu + fp_sigma * np.random.randn(44))
    spectrum = np.interp(x, xp, fp)

    return {
      'frequency': frequency,
      'rms': rms,
      'kurtosis': kurtosis,
      'peakFactor': peakFactor,
      'orderSpectrum': {
        'order0': order0,
        'dOrder': self.config['dOrder'],
        'spectrum': spectrum
      }
    }
