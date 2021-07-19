const express = require("express");
const router = express.Router();

const dropdownValues = {
  lowpass: {
    values: [32, 64, 125, 250, 500, 1000],
    unit: "Hz",
  },
  range: {
    values: [2, 4, 8, 16],
    unit: "g",
  },
};

let settings = {
  sensor: {
    lowpass: 250,
    range: 4,
  },
  tachoPoints: 1,
  spectrum: {
    dOrder: 0.1,
    max_order: 10,
  },
  window: {
    length: 1,
    overlap: 0.5,
  },
  averages: 10,
};

router.get("/", (req, res) => {
  res.json({ dropdown: dropdownValues, settings: settings });
});

router.post("/", (req, res) => {
  console.log(req.json());
})

module.exports = router;
