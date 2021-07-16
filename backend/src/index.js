const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors);

const port = process.env.PORT || 3001;

app.get('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

function getData() {
  const orderSpec = {
    o0: 0,
    dt: 0.5,
    spec: [0, 0.1, 2.5, 0, 0.3, 0.1, 0.6, 0.2, 1.4, 0.1, 0.5, 0, 0.1]
  };

  let x = [];
  let newX = orderSpec.o0;
  for (let i = 0; i < orderSpec.spec.length; i++) {
    x.push(newX);
    newX += orderSpec.dt;
  }

  return {
    freq: 41.7,
    rms: 1.5,
    kurt: 3.05,
    peak: 0.707,
    spec: {
      x: x,
      y: orderSpec.spec,
    }
  };
}

app.get('/data', (req, res) => {
  res.json(getData());
});

app.listen(port);
