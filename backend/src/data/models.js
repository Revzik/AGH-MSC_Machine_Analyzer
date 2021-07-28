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

const defaultId = 1;
const configSchema = new Schema({
  _id: { type: Number },
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

Config.exists({_id: defaultId}, (err, exists) => {
  if (err) {
    console.error("Error while fetching default config!")
    console.error(err);
    return;
  }
  if (exists) {
    console.log("Config already exists");
    return
  }
  const defaultConfig = new Config({ _id: defaultId});
  defaultConfig.save((err) => {
    if (err) {
      console.error("Error while inserting default config!")
      console.error(err);
      return;
    }
    log.info("Generated default config");
  })
})

module.exports = {
  Data,
  Config,
};
