const log = require("../log/logger")(__filename);

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema, model and its id

const POS_INF = { type: Number, default: Infinity };
const NEG_INF = { type: Number, default: -Infinity };

const defaultId = 1;
const thresholdsSchema = new Schema({
  _id: Number,
  x: {
    rms: { min: NEG_INF, max: POS_INF },
    peak: { min: NEG_INF, max: POS_INF },
    kurtosis: { min: NEG_INF, max: POS_INF },
    crestFactor: { min: NEG_INF, max: POS_INF },
    orderSpectrum: [],
  },
  y: {
    rms: { min: NEG_INF, max: POS_INF },
    peak: { min: NEG_INF, max: POS_INF },
    kurtosis: { min: NEG_INF, max: POS_INF },
    crestFactor: { min: NEG_INF, max: POS_INF },
    orderSpectrum: [],
  },
  z: {
    rms: { min: NEG_INF, max: POS_INF },
    peak: { min: NEG_INF, max: POS_INF },
    kurtosis: { min: NEG_INF, max: POS_INF },
    crestFactor: { min: NEG_INF, max: POS_INF },
    orderSpectrum: [],
  },
});

const ThresholdsModel = mongoose.model("Threshold", thresholdsSchema);

// Save and load functions

const saveThresholds = (thresholds) => {
  log.info("Saving thresholds to the database");
  return new Promise((resolve, reject) => {
    ThresholdsModel.updateOne({ _id: defaultId }, { ...thresholds }, (err) => {
      if (err) {
        log.error(`Could not update thresholds with id ${defaultId}`);
        reject(err);
        return;
      }
      log.info("Thresholds updated");
      resolve();
    });
  });
};

const loadThresholds = () => {
  log.info("Loading thresholds from the database");
  return new Promise((resolve, reject) => {
    ThresholdsModel.findById(defaultId, (err, res) => {
      if (err) {
        log.error(`Could not fetch thresholds with id ${defaultId}`);
        reject(err);
        return;
      }
      log.info("Fetched thresholds from the database");
      resolve(res);
    });
  });
};

// Setup

function createDefaultThresholds() {
  const defaultThresholds = new ThresholdsModel({ _id: defaultId });
  defaultThresholds.save((err) => {
    if (err) {
      log.error("Error while inserting default thresholds!");
      log.error(err);
      return;
    }
    log.info("Generated default thresholds");
  });
}

ThresholdsModel.exists({ _id: defaultId }, (err, exists) => {
  if (err) {
    log.error("Error while fetching default thresholds!");
    log.error(err);
    return;
  }
  if (exists) {
    log.info("Thresholds already exist");
    return;
  }

  createDefaultThresholds();
});

// Exports

module.exports = { saveThresholds, loadThresholds };
