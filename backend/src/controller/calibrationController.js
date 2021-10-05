const log = require('../log/logger')(__filename);
log.info("Setting up calibration controller");

const express = require("express");
const router = express.Router();

const calibrationService = require("../service/calibrationService");

router.get("/", (req, res) => {
  res.json(calibrationService.getAcceleration());
});

router.get("/status", (req, res) => {
  res.json({ status: calibrationService.isCalibrationRunning() });
});

router.post("/cal", (req, res) => {
  calibrationService.calibrate(req.body);
  res.sendStatus(200);
});

router.post("/startCheck", (req, res) => {
  calibrationService.startCalibrationCheck();
  res.sendStatus(200);
});

router.post("/startCal", (req, res) => {
  calibrationService.startCalibration();
  res.sendStatus(200);
});

router.post("/stop", (req, res) => {
  calibrationService.stopCalibration();
  res.sendStatus(200);
});

module.exports = router;
