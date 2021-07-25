const express = require("express");
const app = express();

const log = require("#log/logger").createLogger(__filename);

log.info("Connecting to database...");
const MongoClient = require("mongoose");
MongoClient.connect("mongodb://localhost:27017/mongodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    log.info("Database connected!");
  })
  .catch(() => {
    log.error("Could not connect to the database!");
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
if (dummy) {
  dataController = require("#controller/dummy/dataController");
}

app.use("/data", dataController);
log.info("Controllers set!");

log.info(`App listening on port ${port}`);
app.listen(port);
