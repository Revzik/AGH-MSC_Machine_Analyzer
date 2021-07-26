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
    lowpass: { type: Number, default: 250 },
    range: { type: Number, default: 4 },
  },
  tachoPoints: { type: Number, default: 1 },
  spectrum: {
    dOrder: { type: Number, default: 0.1 },
    max_order: { type: Number, default: 10 },
  },
  window: {
    length: { type: Number, default: 1 },
    overlap: { type: Number, default: 0.5 },
  },
  averages: { type: Number, default: 5 },
});

const Data = mongoose.model("Data", dataSchema);
const Config = mongoose.model("Config", configSchema);

module.exports = {
  Data,
  Config,
};
