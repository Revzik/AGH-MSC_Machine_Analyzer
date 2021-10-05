const log = require("../log/logger")(__filename);

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema, model and its id

const defaultId = 1;
const configSchema = new Schema({
  _id: { type: Number },
  fs: { type: Number, default: 3200 },
  range: { type: Number, default: 16 },
  dOrder: { type: Number, default: 0.1 },
  maxOrder: { type: Number, default: 10 },
  windowLength: { type: Number, default: 200 },
  windowOverlap: { type: Number, default: 50 },
  averages: { type: Number, default: 10 },
});

const ConfigModel = mongoose.model("Config", configSchema);

// Save and load functions

const saveConfig = (config) => {
  log.info("Saving config to the database");
  return new Promise((resolve, reject) => {
    ConfigModel.updateOne({ _id: defaultId }, { ...config }, (err) => {
      if (err) {
        log.error(`Could not update config with id ${defaultId}`);
        reject(err);
        return;
      }
      log.info("Config updated");
      resolve();
    });
  });
};

const loadConfig = () => {
  log.info("Loading config from the database");
  return new Promise((resolve, reject) => {
    ConfigModel.findById(defaultId, (err, res) => {
      if (err) {
        log.error(`Could not fetch config with id ${defaultId}`);
        reject(err);
        return;
      }
      log.info("Fetched config from the database");
      resolve(res);
    });
  });
};

// Setting up default configuration if it doesn't exist

function createDefaultConfig() {
  const defaultConfig = new ConfigModel({ _id: defaultId });
  defaultConfig.save((err) => {
    if (err) {
      log.error("Error while inserting default config!");
      log.error(err);
      return;
    }
    log.info("Generated default config");
  });
}

ConfigModel.exists({ _id: defaultId }, (err, exists) => {
  if (err) {
    log.error("Error while fetching default config!");
    log.error(err);
    return;
  }
  if (exists) {
    log.info("Config already exists");
    return;
  }

  createDefaultConfig();
});

// Exports

module.exports = { saveConfig, loadConfig };
