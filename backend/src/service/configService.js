const { container } = require("../di-setup");
const log = container.resolve('logging').createLogger(__filename);
log.info("Setting up config service");

class ConfigService {
  constructor({ configModel, configId, configMQTT }) {
    this.configModel = configModel;
    this.configId = configId;
    this.configMQTT = configMQTT;
  }

  saveConfig(config) {
    return new Promise((resolve, reject) => {
      this.configModel.updateOne(
        { id: this.configId },
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

  loadConfig() {
    return new Promise((resolve, reject) => {
      this.configModel.findById(this.configId, (err, res) => {
        if (err) {
          log.error(`Could not fetch config ${this.configId}`);
          reject(err);
          return;
        }
        log.info("Fetched config from the database");
        resolve(res);
      });
    });
  }
}

module.exports = ConfigService;
