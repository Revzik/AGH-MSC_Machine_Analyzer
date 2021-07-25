const log = require("#log/logger").createLogger(__filename);
log.info("Starting Machine Analyzer backend");

const express = require("express");
const app = express();
app.use(express.json());

log.info("Connecting to database...");
const MongoClient = require("mongoose");
MongoClient.connect("mongodb://localhost:27017/analyzer", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    log.info("Database connected!");
  })
  .catch((err) => {
    log.error("Could not connect to the database!");
    log.error(err);
  });

const port = process.env.PORT || 4200;
const dummy = process.argv.slice(2).includes("--dummy");
log.info(`App working in ${dummy ? "normal" : "dummy"} mode`);

log.info("Setting Access-Controll...");
app.get("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

log.info("Setting up controllers...");
let dataController = null;
let configController = null;
if (dummy) {
  dataController = require('#controller/dummy/dataController');
  configController = require('#controller/dummy/configController');
}
app.use("/capture", require("#controller/captureController"));
app.use('/data', dataController);
app.use('/config', configController);
log.info("Controllers set!");

log.info(`App listening on port ${port}`);
app.listen(port);
