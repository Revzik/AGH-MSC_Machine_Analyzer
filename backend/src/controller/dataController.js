const log = require("../log/logger")(__filename);
log.info("Setting up dummy data controller");

const express = require("express");
const router = express.Router();

const dataService = require("../service/dataService")

router.get("/", (req, res) => {
  res.json(dataService.data);
});

router.get("/raw", (req, res) => {
  res.json(dataService.rawData);
});

module.exports = router;
