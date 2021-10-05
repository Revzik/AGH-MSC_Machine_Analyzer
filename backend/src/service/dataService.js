const log = require("../log/logger")(__filename);
log.info("Setting up data service");

// Imports

const { PythonShell } = require("python-shell");
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

// Getters

const getData = () => {
  return data;
};

const getRawData = () => {
  return rawData;
};

// Analysis functions

const processData = (data) => {
  analyzeRawData(data);

  if (calibrationService.isCalibrationRunning()) {
    calibrationService.checkCalibration(rawData);
    return;
  }

  if (acquisitionService.isAnalyzing()) {
    analyzeData(data);

    if (acquisitionService.isCapturing()) {
      save(acquisitionService.getLabel());
    }
  }
};

const analyzeRawData = (data) => {
  const options = {
    mode: "text",
    pythonPath: __dirname + "/../../venv/Scripts/python.exe",
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("process_raw.py", options);

  const msg = {
    data: data,
    cal: calibrationService.getCalibration(),
  };

  pyshell.send(JSON.stringify(msg));
  pyshell.on("message", (message) => {
    rawData = JSON.parse(message);
  });
  pyshell.end((err) => {
    if (err) {
      throw err;
    }
    log.info("Raw data processed!");
  });
};

const analyzeData = (data) => {
  const options = {
    mode: "text",
    pythonPath: __dirname + "/../../venv/Scripts/python.exe",
    scriptPath: __dirname + "/../scripts",
  };
  const pyshell = new PythonShell("analyze.py", options);

  const msg = {
    data: data,
    cal: calibrationService.getCalibration(),
    config: configService.getConfig(),
    base_dir: process.env.DATA_DIR,
    capture: acquisitionService.isCapturing(),
    label: acquisitionService.getLabel(),
  };

  pyshell.send(JSON.stringify(msg));
  pyshell.on("message", (message) => {
    data = JSON.parse(message);
  });
  pyshell.end((err) => {
    if (err) {
      throw err;
    }
    log.info("Data processed!");
  });
};

// Exports

module.exports = { getData, getRawData, processData };
