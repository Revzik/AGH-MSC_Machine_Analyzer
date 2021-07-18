const express = require("express");
const router = express.Router();

function strip(number) {
  return parseFloat(parseFloat(number).toPrecision(7));
}

function randomize(amplitude) {
  let min = 0.9 * amplitude;
  let max = 1.1 * amplitude;
  return Math.random() * (max - min) + min;
}

function getOrderSpectrum(max_order, dOrder, orderAmplitudes, noiseAmplitude) {
  let spec = [];
  let nextInt = 0;
  for (let i = 0; i <= max_order; i += dOrder) {
    let rounded = strip(i);
    if (rounded < nextInt) {
      spec.push(randomize(noiseAmplitude));
    } else {
      spec.push(randomize(orderAmplitudes[nextInt]));
      nextInt++;
    }
  }

  return spec;
}

function getDummyData() {
  let dOrder = 0.2;
  let orderAmpl = [0.3, 1.8, 0.4, 1, 0.3, 0.5, 0.3, 0.2, 0.8, 0.2, 0.1];
  let y = getOrderSpectrum(orderAmpl.length - 1, dOrder, orderAmpl, 0.05);

  let currentX = 0;
  let x = [];
  for (let i = 0; i < y.length; i++) {
    x.push(strip(currentX));
    currentX += dOrder;
  }

  let spec = { x: x, y: y };

  return {
    freq: randomize(40),
    rms: randomize(1.8),
    kurt: randomize(3),
    peak: randomize(0.7),
    spec: spec,
  };
}

router.get("/", (req, res) => {
  res.json(getDummyData());
});

module.exports = router;
