const express = require("express");
const app = express();

const port = process.env.PORT || 4200;
const dummy = process.argv.slice(2).includes("--dummy");

app.get("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

let dataController = null;
let configController = null;
if (dummy) {
  dataController = require(__dirname + '/controller/dummy/dataController');
  configController = require(__dirname + '/controller/dummy/configController');

  app.use('/data', dataController);
  app.use('/config', configController);
}

app.listen(port);
