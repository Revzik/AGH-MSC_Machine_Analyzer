const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);

const mongoose = require("mongoose");
const { Schema } = mongoose;

const defaultId = 1;
const configSchema = new Schema({
  _id: { type: Number },
  lowpass: { type: Number, default: 250 },
  range: { type: Number, default: 4 },
  dOrder: { type: Number, default: 0.1 },
  maxOrder: { type: Number, default: 10 },
  windowLength: { type: Number, default: 200 },
  windowOverlap: { type: Number, default: 50 },
  tachoPoints: { type: Number, default: 1 },
  averages: { type: Number, default: 10 },
});

const ConfigModel = mongoose.model("Config", configSchema);

function createDefaultConfig() {
  const defaultConfig = new ConfigModel({ _id: defaultId });
  defaultConfig.save((err) => {
    if (err) {
      log.error("Error while inserting default config!");
      log.error(err);
      return;
    }
    log.info("Generated default config");
  });
}

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

  createDefaultConfig();
});

module.exports = {
  ConfigModel,
  defaultId,
};
