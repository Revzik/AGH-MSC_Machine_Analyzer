const log = require("../log/logger")(__filename);
log.info("Setting up config service");

// Imports

const configModel = require("../data/configModel");
const thresholdsModel = require("../data/thresholdsModel");
const mqtt = require("../mqtt/mqtt");

// Data

let currentConfig = {
  fs: 3200,
  range: 16,
  dOrder: 0.1,
  maxOrder: 10,
  windowLength: 1000,
  windowOverlap: 50,
  averages: 5,
};

let currentThresholds = {
  x: {
    rms: null,
    peak: null,
    kurtosis: { min: null, max: null },
    crestFactor: { min: null, max: null },
  },
  y: {
    rms: null,
    peak: null,
    kurtosis: { min: null, max: null },
    crestFactor: { min: null, max: null },
  },
  z: {
    rms: null,
    peak: null,
    kurtosis: { min: null, max: null },
    crestFactor: { min: null, max: null },
  },
  orderSpectrum: [],
};

// Functions

const getConfig = () => {
  return currentConfig;
};

const getThresholds = () => {
  return currentThresholds;
};

const saveConfig = (config) => {
  currentConfig = config;
  sendConfig(config);
  configModel.saveConfig(config);
};

const restoreConfig = () => {
  sendConfig(currentConfig);
};

const sendConfig = (config) => {
  mqtt.publishConfig(config);
};

const saveThresholds = (thresholds) => {
  currentThresholds = thresholds;
  thresholdsModel.saveThresholds(thresholds);
};

// Setup

configModel
  .loadConfig()
  .then((newConfig) => {
    currentConfig = newConfig;
  })
  .catch(() => {
    log.error("Could not load config from the database, using default");
  });

thresholdsModel
  .loadThresholds()
  .then((newThresholds) => {
    currentThresholds = newThresholds;
  })
  .catch(() => {
    log.error("Could not load thresholds from the database, using default");
  });

// Exports

module.exports = {
  getConfig,
  getThresholds,
  saveConfig,
  restoreConfig,
  sendConfig,
  saveThresholds,
};
