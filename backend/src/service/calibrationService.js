const log = require("../log/logger")(__filename);
log.info("Setting up calibration service");

// Imports

const { PythonShell } = require("python-shell");
const calibrationModel = require("../data/calibrationModel");
const configService = require("./configService");

// Data

let currentCalibration = {
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

let acceleration = {
  x: 0,
  y: 0,
  z: 0,
};

let isChecking = false;
let isCalibrating = false;

// Analysis functions

const checkCalibration = (data) => {
  const options = {
    mode: "text",
    pythonPath: __dirname + "/../../venv/Scripts/python.exe",
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("calibration_check.py", options);

  const msg = {
    x: data.x,
    y: data.y,
    z: data.z,
  };

  pyshell.send(JSON.stringify(msg));
  pyshell.on("message", (message) => {
    acceleration = JSON.parse(message);
  });
  pyshell.end((err) => {
    if (err) {
      throw err;
    }
    log.info("Calibration check calibrationData processed!");
  });
};

const calibrate = (data) => {
  const options = {
    mode: "text",
    pythonPath: __dirname + "/../../venv/Scripts/python.exe",
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("calibrate.py", options);

  pyshell.send(JSON.stringify(data));
  pyshell.on("message", (message) => {
    currentCalibration = JSON.parse(message);
    calibrationModel.saveCalibration(currentCalibration);
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
  configService.sendConfig(config);
};

const startCalibrationCheck = () => {
  isChecking = true;
  start();
};

const startCalibration = () => {
  isCalibrating = true;
  currentCalibration = {
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
  configService.restoreConfig();

  isChecking = false;
  isCalibrating = false;
};

const isCalibrationRunning = () => {
  return isChecking || isCalibrating;
};

// Setting up calibration

currentCalibration = await calibrationModel.loadCalibration();

// Exports

module.exports = {
  currentCalibration,
  acceleration,
  isCalibrationRunning,
  startCalibration,
  startCalibrationCheck,
  stopCalibration,
  checkCalibration,
  calibrate,
};
