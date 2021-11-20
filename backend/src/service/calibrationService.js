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

let checking = false;
let calibrating = false;

// Getters

const isCalibrationRunning = () => {
  return checking || calibrating;
};

const getCalibration = () => {
  return currentCalibration;
};

const getAcceleration = () => {
  return acceleration;
};

// Analysis functions

const checkCalibration = (data) => {
  const options = {
    mode: "json",
    pythonPath: process.env.PYTHON_PATH,
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("calibration_check.py", options);

  const msg = {
    x: data.x,
    y: data.y,
    z: data.z,
  };

  pyshell.send(msg);
  pyshell.on("message", (message) => {
    acceleration = message;
  });
  pyshell.end((err) => {
    if (err) {
      log.error("Could not process calibration data!");
      log.error(err);
    } else {
      log.info("Calibration data processed");
    }
  });
};

const calibrate = (data) => {
  const options = {
    mode: "json",
    pythonPath: process.env.PYTHON_PATH,
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("calibrate.py", options);

  pyshell.send(data);
  pyshell.on("message", (message) => {
    currentCalibration = message;
    calibrationModel.saveCalibration(currentCalibration);
  });
  pyshell.end((err) => {
    if (err) {
      log.error("Could not calculate calibration factors!");
      log.error(err);
    } else {
      log.info("Calibration factors calculated");
    }
  });
};

// Calibration state control

const start = () => {
  acquisitionService.stopAnalysis();
  const config = JSON.parse(JSON.stringify(configService.getConfig()));
  config["windowLength"] = 100;
  config["averages"] = 1;
  configService.sendConfig(config);
};

const startCalibrationCheck = () => {
  checking = true;
  start();
};

const startCalibration = () => {
  calibrating = true;
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

const stopCalibration = async () => {
  configService.restoreConfig();
  currentCalibration = await calibrationModel.loadCalibration();

  checking = false;
  calibrating = false;
};

// Setting up calibration

calibrationModel
  .loadCalibration()
  .then((newCalibration) => {
    currentCalibration = newCalibration;
  })
  .catch(() => {
    log.error("Could not load calibration from the database, using default");
  });

// Exports

module.exports = {
  getCalibration,
  getAcceleration,
  isCalibrationRunning,
  startCalibration,
  startCalibrationCheck,
  stopCalibration,
  checkCalibration,
  calibrate,
};
