const { container } = require("../di-setup");
const log = container.resolve('logging').createLogger(__filename);
log.info("Setting up capture controller");

const express = require("express");
const router = express.Router();

const acquisitionService = container.resolve("acquisitionService");

router.get("/", (req, res) => {
  res.json(acquisitionService.getStatus());
})

router.post("/start", (req, res) => {
  if (!req.body.label) {
    log.error("No label found!");
    res.sendStatus(400);
    return;
  }

  log.info(`Starting capture with label: ${req.body.label}`);
  acquisitionService.startCapturing(req.body.label);
  res.sendStatus(200);
});

router.post("/stop", (req, res) => {
  log.info("Stopping capture");
  acquisitionService.stopCapturing();
  res.sendStatus(200);
});

module.exports = router;
