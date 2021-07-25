const log = require("#log/logger").createLogger(__filename);
log.info("Setting up capture controller");

const express = require("express");
const router = express.Router();

const { startCapture, stopCapture } = require("#service/dataService");

router.post("/start", (req, res) => {
  if (!req.body.label) {
    log.error("No label found!");
    res.sendStatus(400);
    return;
  }

  log.info(`Starting capture with ${req.body.label} label`);
  startCapture(req.body.label);
  res.sendStatus(200);
});

router.post("/stop", (req, res) => {
  log.info("Stopping capture");
  stopCapture();
  res.sendStatus(200);
});

module.exports = router;
