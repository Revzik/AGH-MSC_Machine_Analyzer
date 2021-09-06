const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up dummy data controller");

const express = require("express");
const router = express.Router();

const dataService = container.resolve("dataService");

router.get("/", (req, res) => {
  res.json(dataService.getData());
});

router.get("/raw", (req, res) => {
  res.json(dataService.getRawData());
});

router.get("/debug", (req, res) => {
  res.json(dataService.getDebugData());
});

module.exports = router;
