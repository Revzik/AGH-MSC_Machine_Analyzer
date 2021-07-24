const express = require("express");
const app = express();

const MongoClient = require("mongoose");
MongoClient.connect("mongodb://localhost:27017/mongodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 4200;
const dummy = process.argv.slice(2).includes("--dummy");

app.get("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

let dataController = null;
if (dummy) {
  dataController = require(__dirname + "/controller/dummyController");
}

app.use("/data", dataController);

app.listen(port);
