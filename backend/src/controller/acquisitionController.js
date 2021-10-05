const log = require("../log/logger")(__filename);
log.info("Setting up capture controller");

const express = require("express");
const router = express.Router();

const acquisitionService = require("../service/acquisitionService");

router.get("/", (req, res) => {
  res.json({
    analyzing: acquisitionService.isAnalyzing,
    capturing: acquisitionService.isCapturing,
    label: acquisitionService.currentLabel,
  });
});

router.post("/start", (req, res) => {
  log.info("Starting analysis");
  acquisitionService.startAnalysis();
  res.sendStatus(200);
});

router.post("/stop", (req, res) => {
  log.info("Stopping analysis");
  acquisitionService.stopAnalysis();
  res.sendStatus(200);
});

router.post("/capture/start", (req, res) => {
  const newLabel = req.body.label;
  if (!newLabel || newLabel === "") {
    log.error("No label found!");
    res.sendStatus(400);
    return;
  }

  log.info(`Starting capture with label: ${newLabel}`);
  acquisitionService.startCapturing(newLabel);
  res.sendStatus(200);
});

router.post("/capture/stop", (req, res) => {
  log.info("Stopping capture");
  acquisitionService.stopCapturing();
  res.sendStatus(200);
});

module.exports = router;
