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

const DataModel = mongoose.model("Data", dataSchema);

module.exports = DataModel;
