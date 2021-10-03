require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

// const { container, setup } = require("./di-setup");
// setup();
const Logger = require("./log/logger");
const log = new Logger().createLogger(__filename);

log.info("Connecting to database...");
const MongoClient = require("mongoose");
MongoClient.connect(process.env.DB_URL, {
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

log.info("Setting up MQTT client...");
container.resolve("mqttDispatcher").init();

const port = process.env.PORT || 4200;

log.info("Setting up CORS");
const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  })
);

log.info("Setting up controllers...");
app.use("/acquire", require("./controller/acquisitionController"));
app.use("/data", require("./controller/dataController"));
app.use("/config", require("./controller/configController"));
app.use("/calibrate", require("./controller/calibrationController"));
log.info("Controllers set!");

log.info(`App listening on port ${port}`);
app.listen(port);
