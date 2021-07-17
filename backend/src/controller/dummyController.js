const express = require("express");
const router = express.Router();

function strip(number) {
  return parseFloat(number).toPrecision(7);
}

function randomize(amplitude) {
  let min = 0.9 * amplitude;
  let max = 1.1 * amplitude;
  return Math.random() * (max - min) + min;
}

function getOrderSpectrum(max_order, dOrder, orderAmplitudes, noiseAmplitude) {
  console.log("Generating dummy spectrum...");
  let spec = [];
  let nextInt = 0;
  for (let i = 0; i <= max_order; i += dOrder) {
    let rounded = strip(i);
    console.log(`i: ${rounded}, next: ${nextInt}`);
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
  let orderSpec = getOrderSpectrum(
    orderAmpl.length - 1,
    dOrder,
    orderAmpl,
    0.05
  );
  let x = 0;
  let spec = [];
  orderSpec.forEach((y) => {
    spec.push({ x: x, y: y });
    x += dOrder;
  });

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
