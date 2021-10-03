const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);

const mongoose = require("mongoose");
const { Schema } = mongoose;

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

function createDefaultCalibration() {
  const defaultConfig = new CalibrationModel({ _id: defaultId });
  defaultConfig.save((err) => {
    if (err) {
      log.error("Error while inserting default calibration!");
      log.error(err);
      return;
    }
    log.info("Generated default calibration");
  });
}

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

const saveCalibration = (calibration) => {
  log.info("Saving calibration to the database");
  return new Promise((resolve, reject) => {
    this.calibrationModel.updateOne({ _id: defaultId }, { ...calibration }, (err) => {
      if (err) {
        log.error(`Could not update calibration with id ${defaultId}`);
        reject(err);
        return;
      }
      log.info("Calibration updated");
      resolve();
    });
  });
}

const loadCalibration = () => {
  log.info("Loading calibration from the database");
  return new Promise((resolve, reject) => {
    this.calibrationModel.findById(defaultId, (err, res) => {
      if (err) {
        log.error(`Could not fetch calibration with id ${defaultId}`);
        reject(err);
        return;
      }
      log.info("Fetched calibration from the database");
      this.cal = res;
      resolve(res);
    });
  });
}

module.exports = { saveCalibration, loadCalibration };
