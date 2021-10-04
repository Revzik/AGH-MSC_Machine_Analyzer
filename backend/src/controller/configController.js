const log = require("../log/logger")(__filename);
log.info("Setting up config controller");

const express = require("express");
const router = express.Router();

const configService = require("../service/configService");

router.get("/", (req, res) => {
  res.json(configService.currentConfig);
});

router.post("/", (req, res) => {
  configService.saveConfig(req.body);
  res.sendStatus(200);
});

module.exports = router;
