const log = require("../log/logger")(__filename);

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema and model

const dataSchema = new Schema({
  label: String,
  f: Number,
  x: {
    rms: Number,
    peak: Number,
    kurtosis: Number,
    crestFactor: Number,
    orderSpectrum: [Number],
  },
  y: {
    rms: Number,
    peak: Number,
    kurtosis: Number,
    crestFactor: Number,
    orderSpectrum: [Number],
  },
  z: {
    rms: Number,
    peak: Number,
    kurtosis: Number,
    crestFactor: Number,
    orderSpectrum: [Number],
  },
  orders: [Number],
});

const DataModel = mongoose.model("Data", dataSchema);

// Functions

const saveData = (label, data) => {
  log.info(`Saving data with label ${label} to the database`);
  return new Promise((resolve, reject) => {
    const newData = new DataModel({ label: label, ...data });
    newData
      .save()
      .then(() => {
        log.info("Data succesfully saved!");
        resolve();
      })
      .catch(() => {
        log.error("Could not save data!");
        reject();
      });
  });
};

// Exports

module.exports = { saveData };
