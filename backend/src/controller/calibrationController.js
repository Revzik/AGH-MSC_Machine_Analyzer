const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up calibration controller");

const express = require("express");
const router = express.Router();

const calibrationService = container.resolve("calibrationService");

router.get("/", (req, res) => {
  res.json(calibrationService.getData());
});

router.post("/check/start", (req, res) => {
  calibrationService.startCheck();
  res.sendStatus(200);
});

router.post("/check/stop", (req, res) => {
  calibrationService.stopCheck();
  res.sendStatus(200);
});

router.post("/cal", (req, res) => {
  calibrationService.sendCalibration(req.body);
  res.sendStatus(200);
});

router.post("/cal/start", (req, res) => {
  calibrationService.startCalibration();
  res.sendStatus(200);
});

router.post("/cal/stop", (req, res) => {
  calibrationService.stopCalibration();
  res.sendStatus(200);
});

module.exports = router;
