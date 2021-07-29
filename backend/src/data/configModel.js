const { container } = require("../di-setup");
const log = container.resolve('logging').createLogger(__filename);

const mongoose = require("mongoose");
const { Schema } = mongoose;

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

const ConfigModel = mongoose.model("Config", configSchema);

ConfigModel.exists({ _id: defaultId }, (err, exists) => {
  if (err) {
    log.error("Error while fetching default config!");
    log.error(err);
    return;
  }
  if (exists) {
    log.info("Config already exists");
    return;
  }
  const defaultConfig = new Config({ _id: defaultId });
  defaultConfig.save((err) => {
    if (err) {
      log.error("Error while inserting default config!");
      log.error(err);
      return;
    }
    log.info("Generated default config");
  });
});

module.exports = {
  ConfigModel,
  defaultId,
};
