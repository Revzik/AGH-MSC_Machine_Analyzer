const express = require("express");
const app = express();

const port = process.env.PORT || 4200;
const dummy = process.argv.slice(2).includes("--dummy");

app.get("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

let dataController = null;
if (dummy) {
  dataController = require(__dirname + '/controller/dummyController');
}

app.use('/data', dataController);

app.listen(port);
