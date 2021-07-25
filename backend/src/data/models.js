const log = require("#log/logger").createLogger(__filename);
log.info("Setting up database models");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const dataSchema = new Schema({
  label: String,
  frequency: Number,
  rms: Number,
  kurtosis: Number,
  peakFactor: Number,
  orderSpectrum: {
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

const Data = mongoose.model("Data", dataSchema);
const Config = mongoose.model("Config", configSchema);

module.exports = {
  Data,
  Config,
};
