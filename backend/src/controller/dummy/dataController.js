const log = require("#log/logger").createLogger(__filename);
log.info("Setting up dummy data controller");

const express = require("express");
const router = express.Router();
const { getData } = require("#service/dataService");
const { start, stop } = require("#data/dummy/subscriber");

const INTERVAL = 5000;
start(INTERVAL);

router.get("/", (req, res) => {
  res.json(getData());
});

router.get("/start", (req, res) => {
  start(INTERVAL);
  res.ok();
});

router.get("/stop", (req, res) => {
  stop();
  res.ok();
});

module.exports = router;
