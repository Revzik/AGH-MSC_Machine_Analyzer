const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up calibration controller");

const express = require("express");
const router = express.Router();

const calibrationService = container.resolve("calibrationService");

router.get("/", (req, res) => {
  res.json(calibrationService.getData());
});

router.post("/", (req, res) => {
  calibrationService.saveData(req.body);
  res.sendStatus(200);
});

router.post("/start", (req, res) => {
  calibrationService.startCalibration();
  res.sendStatus(200);
})

router.post("/stop", (req, res) => {
  calibrationService.stopCalibration();
  res.sendStatus(200);
})

module.exports = router;
