const mongoose = require("mongoose");

const { Schema, Model } = mongoose;

const dataSchema = new Schema({
  label: String,
  frequency: Number,
  rms: Number,
  kurtosis: Number,
  peak_factor: Number,
  order_spectrum: {
    order0: Number,
    dOrder: Number,
    spectrum: [Number],
  },
});

const configSchema = new Schema({
  sensor: {
    lowpass: Number,
    range: Number,
  },
  tachoPoints: Number,
  spectrum: {
    dOrder: Number,
    max_order: Number,
  },
  window: {
    length: Number,
    overlap: Number,
  },
  averages: Number,
});

module.exports = {
  dataModel: new Model("Data", dataSchema),
  configModel: new Model("Config", configSchema),
};
