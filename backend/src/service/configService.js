const log = require("../log/logger")(__filename);
log.info("Setting up config service");

// Imports

const configModel = require("../data/configModel");
const mqtt = require("../mqtt/mqtt");

// Data

let currentConfig = {
  fs: 3200,
  range: 16,
  dOrder: 0.1,
  maxOrder: 10,
  windowLength: 1000,
  windowOverlap: 50,
  tachoPoints: 1,
  averages: 5,
};

// Functions

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

// Setup

loadConfig()
  .then((config) => {
    currentConfig = config;
  })
  .catch(() => {
    log.error("Could not load config, using default");
  });

// Exports

module.exports = { currentConfig, saveConfig, restoreConfig, sendConfig };
