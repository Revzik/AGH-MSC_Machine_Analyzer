const express = require("express");
const app = express();
app.use(express.json());

const dummy = process.argv.slice(2).includes("--dummy");
const { container, setup } = require("./di-setup");
setup(dummy);
const log = container.resolve("logging").createLogger(__filename);

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

log.info("Setting up CORS");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

log.info("Setting up controllers...");
app.use("/acquire", require("./controller/acquisitionController"));
app.use("/data", require("./controller/dataController"));
app.use("/config", require("./controller/configController"));
log.info("Controllers set!");

log.info(`App listening on port ${port}`);
app.listen(port);
