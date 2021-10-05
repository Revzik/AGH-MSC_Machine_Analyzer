const log = require("../log/logger")(__filename);
log.info("Setting up acquisition service");

const calibrationService = require("./calibrationService");

// Data

let analyzing = false;
let capturing = false;
let currentLabel = "";

// Functions

const isAnalyzing = () => {
  return analyzing;
};

const isCapturing = () => {
  return capturing;
};

const getLabel = () => {
  return currentLabel;
};

const startAnalysis = () => {
  calibrationService.stopCalibration();
  analyzing = true;
};

const stopAnalysis = () => {
  stopCapturing();
  analyzing = false;
};

const startCapturing = (newLabel) => {
  capturing = true;
  currentLabel = newLabel;
};

const stopCapturing = () => {
  capturing = false;
  currentLabel = "";
};

// Exports

module.exports = {
  isAnalyzing,
  isCapturing,
  getLabel,
  startAnalysis,
  stopAnalysis,
  startCapturing,
  stopCapturing,
};
