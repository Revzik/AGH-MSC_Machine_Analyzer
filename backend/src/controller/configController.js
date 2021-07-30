const { container } = require("../di-setup");
const log = container.resolve('logging').createLogger(__filename);
log.info("Setting up config controller");

const express = require("express");
const router = express.Router();

const configService = container.resolve("configService");

router.get("/settings", (req, res) => {
  configService.loadConfig()
    .then((config) => {
      res.json(config);
    })
    .catch((err) => {
      log.error(err);
      res.sendStatus(500);
    });
});

router.post("/settings", (req, res) => {
  configService.saveConfig(req.body)
    .then((config) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      log.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;