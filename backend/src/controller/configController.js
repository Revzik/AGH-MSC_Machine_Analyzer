const log = require("../log/logger")(__filename);
log.info("Setting up config controller");

const express = require("express");
const { config } = require("winston");
const router = express.Router();

const configService = require("../service/configService");

router.get("/", (req, res) => {
  res.json(configService.getConfig());
});

router.post("/", (req, res) => {
  configService.saveConfig(req.body);
  res.sendStatus(200);
});

router.get("/thresholds", (req, res) => {
  res.json(configService.getThresholds());
});

router.post("/thresholds", (req, res) => {
  configService.saveThresholds(req.body);
  res.sendStatus(200);
});

module.exports = router;
