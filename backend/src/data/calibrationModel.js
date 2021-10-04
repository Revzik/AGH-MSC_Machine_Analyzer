const log = require("../log/logger")(__filename);

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema, model and its id

const defaultId = 1;
const calibrationSchema = new Schema({
  _id: { type: Number },
  sensitivity: {
    x: { type: Number, default: 1 },
    y: { type: Number, default: 1 },
    z: { type: Number, default: 1 },
  },
  offset: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
  },
});

const CalibrationModel = mongoose.model("Calibration", calibrationSchema);

// Save and load functions

const saveCalibration = (calibration) => {
  log.info("Saving calibration to the database");
  return new Promise((resolve, reject) => {
    CalibrationModel.updateOne(
      { _id: defaultId },
      { ...calibration },
      (err) => {
        if (err) {
          log.error(`Could not update calibration with id ${defaultId}`);
          reject(err);
          return;
        }
        log.info("Calibration updated");
        resolve();
      }
    );
  });
};

const loadCalibration = () => {
  log.info("Loading calibration from the database");
  return new Promise((resolve, reject) => {
    CalibrationModel.findById(defaultId, (err, res) => {
      if (err) {
        log.error(`Could not fetch calibration with id ${defaultId}`);
        reject(err);
        return;
      }
      log.info("Fetched calibration from the database");
      resolve(res);
    });
  });
};

// Setting up default calibration if it doesn't exist

const createDefaultCalibration = () => {
  const defaultConfig = new CalibrationModel({ _id: defaultId });
  defaultConfig.save((err) => {
    if (err) {
      log.error("Error while inserting default calibration!");
      log.error(err);
      return;
    }
    log.info("Generated default calibration");
  });
};

CalibrationModel.exists({ _id: defaultId }, (err, exists) => {
  if (err) {
    log.error("Error while fetching default calibration!");
    log.error(err);
    return;
  }
  if (exists) {
    log.info("Calibration already exists");
    return;
  }

  createDefaultCalibration();
});

// Exports

module.exports = { saveCalibration, loadCalibration };
