const log = require("#log/logger").createLogger(__filename);
log.info("Setting up dummy data controller");

const express = require("express");
const router = express.Router();
const { getData } = require("#service/dataService");
const { start, stop } = require("#data/dummy/dataSubscriber");

const INTERVAL = 5000;
start(INTERVAL);

router.get("/", (req, res) => {
  res.json(getData());
});

router.post("/start", (req, res) => {
  start(INTERVAL);
  res.sendStatus(200);
});

router.post("/stop", (req, res) => {
  stop();
  res.sendStatus(200);
});

module.exports = router;
