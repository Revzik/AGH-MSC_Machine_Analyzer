const log = require("../log/logger")(__filename);
log.info("Setting up acquisition service");

const calibrationService = require("./calibrationService");

// Data

let isAnalyzing = false;
let isCapturing = false;
let currentLabel = "";

// Functions

const startAnalysis = () => {
  calibrationService.stopCalibration();
  isAnalyzing = true;
};

const stopAnalysis = () => {
  stopCapturing();
  isAnalyzing = false;
};

const startCapturing = (newLabel) => {
  isCapturing = true;
  currentLabel = newLabel;
};

const stopCapturing = () => {
  this.capturing = false;
  currentLabel = "";
};

// Exports

module.exports = {
  isAnalyzing,
  isCapturing,
  currentLabel,
  startAnalysis,
  stopAnalysis,
  startCapturing,
  stopCapturing,
};
