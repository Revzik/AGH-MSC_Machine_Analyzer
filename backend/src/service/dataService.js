const log = require("../log/logger")(__filename);
log.info("Setting up data service");

// Imports

const { PythonShell } = require("python-shell");
const dataModel = require("../data/dataModel");
const acquisitionService = require("./acquisitionService");
const calibrationService = require("./calibrationService");
const configService = require("./configService");

// Data

let rawData = {
  t0: 0,
  dt: 0,
  nt: 0,
  t: [],
  x: [],
  y: [],
  z: [],
  f: [],
  ft: [],
};

let data = {
  f: 0,
  x: {
    rms: 0,
    peak: 0,
    kurtosis: 0,
    crestFactor: 0,
    orderSpectrum: [],
  },
  y: {
    rms: 0,
    peak: 0,
    kurtosis: 0,
    crestFactor: 0,
    orderSpectrum: [],
  },
  z: {
    rms: 0,
    peak: 0,
    kurtosis: 0,
    crestFactor: 0,
    orderSpectrum: [],
  },
  orders: [],
};

let validations = {
  x: {
    rms: true,
    peak: true,
    kurtosis: true,
    crestFactor: true,
  },
  y: {
    rms: true,
    peak: true,
    kurtosis: true,
    crestFactor: true,
  },
  z: {
    rms: true,
    peak: true,
    kurtosis: true,
    crestFactor: true,
  },
  orders: [],
};

// Getters

const getData = () => {
  return data;
};

const getValidatedData = () => {
  return {
    data: data,
    validations: validations,
  };
};

const getRawData = () => {
  return rawData;
};

// Analysis functions

const processData = (newData) => {
  analyzeRawData(newData);

  if (calibrationService.isCalibrationRunning()) {
    calibrationService.checkCalibration(rawData);
    return;
  }

  if (acquisitionService.isAnalyzing()) {
    analyzeData(newData);
  }
};

const analyzeRawData = (newData) => {
  const options = {
    mode: "json",
    pythonPath: process.env.PYTHON_PATH,
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("process_raw.py", options);

  const msg = {
    data: newData,
    cal: calibrationService.getCalibration(),
  };

  pyshell.send(msg);
  pyshell.on("message", (message) => {
    rawData = message;
  });
  pyshell.end((err) => {
    if (err) {
      log.error("Could not process raw data!");
      log.error(err);
    } else {
      log.info("Raw data processed");
    }
  });
};

const analyzeData = (newData) => {
  const options = {
    mode: "json",
    pythonPath: process.env.PYTHON_PATH,
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("analyze.py", options);

  const msg = {
    data: newData,
    cal: calibrationService.getCalibration(),
    config: configService.getConfig(),
    capture: acquisitionService.isCapturing(),
    label: acquisitionService.getLabel(),
  };

  pyshell.send(msg);
  pyshell.on("message", (message) => {
    data = message;

    if (acquisitionService.isCapturing()) {
      dataModel.saveData(acquisitionService.getLabel(), data);
    }

    analyzeThresholds(data);
  });
  pyshell.end((err) => {
    if (err) {
      log.error("Could not analyze data!");
      log.error(err);
    } else {
      log.info("Data analyzed");
    }
  });
};

const analyzeThresholds = (analyzedData) => {
  const options = {
    mode: "json",
    pythonPath: process.env.PYTHON_PATH,
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("validate.py", options);

  const msg = {
    data: analyzedData,
    thresholds: configService.getThresholds(),
  };

  pyshell.send(msg);
  pyshell.on("message", (message) => {
    validations = message;
  });
  pyshell.end((err) => {
    if (err) {
      log.error("Could not validate data!");
      log.error(err);
    } else {
      log.info("Data validated");
    }
  });
};

// Exports

module.exports = { getData, getValidatedData, getRawData, processData };
