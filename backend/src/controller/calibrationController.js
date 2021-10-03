const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up calibration controller");

const express = require("express");
const router = express.Router();

const calibrationService = container.resolve("calibrationService");

router.get("/", (req, res) => {
  res.json(calibrationService.getData());
});

router.get("/status", (req, res) => {
  res.json({ status: calibrationService.isRunning() });
});

router.post("/cal", (req, res) => {
  calibrationService.calibrate(req.body);
  res.sendStatus(200);
});

router.post("/startCheck", (req, res) => {
  calibrationService.startCheck();
  res.sendStatus(200);
});

router.post("/startCal", (req, res) => {
  calibrationService.startCalibration();
  res.sendStatus(200);
});

router.post("/stop", (req, res) => {
  calibrationService.stop();
  res.sendStatus(200);
});

module.exports = router;
