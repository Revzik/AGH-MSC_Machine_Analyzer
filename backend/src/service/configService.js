const log = require("#log/logger").createLogger(__filename);
log.info("Setting up config service");

const { Config } = require("#data/models");
const defaultId = "def";

function saveConfig(config) {
  return new Promise((resolve, reject) => {
    Config.updateOne(
      { id: defaultId },
      config,
      { upsert: true },
      (err, res) => {
        if (err) {
          log.error("Could not update config!");
          reject(err);
          return;
        }
        log.info(`Updated config: ${config}`);
        resolve(res);
      }
    );
  });
}

function loadConfig() {
  return new Promise((resolve, reject) => {
    Config.findById(defaultId, (err, res) => {
      if (err) {
        log.error(`Could not fetch config ${defaultId}`);
        reject(err);
        return;
      }
      log.info("Fetched config from the database");
      resolve(res);
    });
  });
}

module.exports = { saveConfig, loadConfig };
