const log = require('../log/logger')(__filename);
log.info("Setting up calibration controller");

const express = require("express");
const router = express.Router();

const {
  calibrationData,
  isCalibrationRunning,
  calibrate,
  startCalibrationCheck,
  startCalibration,
  stopCalibration,
} = require("../service/calibrationService");

router.get("/", (req, res) => {
  res.json(calibrationData);
});

router.get("/status", (req, res) => {
  res.json({ status: isCalibrationRunning });
});

router.post("/cal", (req, res) => {
  calibrate(req.body);
  res.sendStatus(200);
});

router.post("/startCheck", (req, res) => {
  startCalibrationCheck();
  res.sendStatus(200);
});

router.post("/startCal", (req, res) => {
  startCalibration();
  res.sendStatus(200);
});

router.post("/stop", (req, res) => {
  stopCalibration();
  res.sendStatus(200);
});

module.exports = router;
