const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up config service");

class ConfigService {
  constructor({ configModel, configId, configMQTT }) {
    this.configModel = configModel;
    this.configId = configId;
    this.configMQTT = configMQTT;
  }

  saveConfig(config) {
    log.info("Saving config to the database");
    this.configMQTT.publishConfig(config);

    return new Promise((resolve, reject) => {
      this.configModel.updateOne(
        { _id: this.configId },
        { ...config },
        (err) => {
          if (err) {
            log.error(`Could not update config with id ${this.configId}`);
            reject(err);
            return;
          }
          log.info("Config updated");
          resolve();
        }
      );
    });
  }

  loadConfig() {
    log.info("Loading config from the database");
    return new Promise((resolve, reject) => {
      this.configModel.findById(this.configId, (err, res) => {
        if (err) {
          log.error(`Could not fetch config with id ${this.configId}`);
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
