const { container } = require("../di-setup");
const log = container.resolve('logging').createLogger(__filename);
log.info("Setting up config controller");

const express = require("express");
const router = express.Router();

const configService = container.resolve("configService");

const dropdownValues = {
  lowpass: {
    values: [32, 64, 125, 250, 500, 1000],
    unit: "Hz",
  },
  range: {
    values: [2, 4, 8, 16],
    unit: "g",
  },
};

router.get("/dropdown", (req, res) => {
  res.json(dropdownValues);
});

router.get("/settings", (req, res) => {
  configService.loadConfig()
    .then((config) => {
      res.json(config);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.post("/settings", (req, res) => {
  configService.saveConfig(req.body)
    .then((config) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
