const express = require("express");

const app = express();

const port = process.env.PORT || 4200;

app.get("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

function getData() {
  const orderSpec = {
    o0: 0,
    do: 0.5,
    spec: [0, 0.1, 2.5, 0, 0.3, 0.1, 0.6, 0.2, 1.4, 0.1, 0.5, 0, 0.1],
  };

  let spec = [];
  let x = orderSpec.o0;
  orderSpec.spec.forEach((y) => {
    spec.push({ x: x, y: y });
    x += orderSpec.do;
  });

  return {
    freq: 41.7,
    rms: 1.5,
    kurt: 3.05,
    peak: 0.707,
    spec: spec,
  };
}

app.get("/data", (req, res) => {
  res.json(getData());
});

app.listen(port);
