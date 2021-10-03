const log = require('../log/logger')(__filename);
log.info("Setting up calibration service");

// Imports

const { PythonShell } = require("python-shell");
const {
  loadCalibration,
  saveCalibration,
} = require("../calibrationData/calibrationModel");

// Data

let calibration = {
  sensitivity: {
    x: 1,
    y: 1,
    z: 1,
  },
  offset: {
    x: 0,
    y: 0,
    z: 0,
  },
};

let calibrationData = {
  x: 0,
  y: 0,
  z: 0,
};

let isChecking = false;
let isCalibrating = false;

// Analysis functions

const checkCalibration = (calibrationData) => {
  const options = {
    mode: "text",
    pythonPath: __dirname + "/../../venv/Scripts/python.exe",
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("calibration_check.py", options);

  const msg = {
    x: calibrationData.x,
    y: calibrationData.y,
    z: calibrationData.z,
  };

  pyshell.send(JSON.stringify(msg));
  pyshell.on("message", (message) => {
    calibrationData = JSON.parse(message);
  });
  pyshell.end((err) => {
    if (err) {
      throw err;
    }
    log.info("Calibration check calibrationData processed!");
  });
};

const calibrate = (calibrationData) => {
  const options = {
    mode: "text",
    pythonPath: __dirname + "/../../venv/Scripts/python.exe",
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("calibrate.py", options);

  pyshell.send(JSON.stringify(calibrationData));
  pyshell.on("message", (message) => {
    saveCalibration(JSON.parse(message));
  });
  pyshell.end((err) => {
    if (err) {
      throw err;
    }
    log.info("Calibration calibrationData processed!");
  });
};

// Calibration state control

const start = () => {
  acquisitionService.stopAnalysis(); // TODO: Update stopAnalysis
  const config = JSON.parse(JSON.stringify(this.configService.getConfig())); // TODO: Update getConfig
  config["windowLength"] = 100;
  config["averages"] = 1;
  configService.sendConfig(config); // TODO: Update sendConfig
};

const startCalibrationCheck = () => {
  isChecking = true;
  start();
};

const startCalibration = () => {
  isCalibrating = true;
  cal = {
    sensitivity: {
      x: 1,
      y: 1,
      z: 1,
    },
    offset: {
      x: 0,
      y: 0,
      z: 0,
    },
  };
  start();
};

const stopCalibration = () => {
  configService.restoreConfig(); // TODO: Update restoreConfig
  if (isCalibrating) {
    loadCalibration();
  }

  isChecking = false;
  isCalibrating = false;
};

const isCalibrationRunning = () => {
  return isChecking || isCalibrating;
};

// Setting up calibration

loadCalibration()
  .then((cal) => {
    calibration = cal;
  })
  .catch(
    log.error("Failed to load calibration from the database, using default")
  );

// Exports

module.exports = {
  calibration,
  calibrationData,
  isCalibrationRunning,
  startCalibration,
  startCalibrationCheck,
  stopCalibration,
  checkCalibration,
  calibrate,
};
