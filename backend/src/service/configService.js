const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up config service");

class ConfigService {
  constructor({ configModel, configPublisher }) {
    this.configModel = configModel;
    this.configId = 1;
    this.configPublisher = configPublisher;
    this.config = {
      fs: 3200,
      range: 16,
      dOrder: 0.1,
      maxOrder: 10,
      windowLength: 1000,
      windowOverlap: 50,
      tachoPoints: 1,
      averages: 5,
    };

    this.loadConfig();
  }

  getConfig() {
    return this.config;
  }

  sendConfig(config) {
    log.info("Sending temporary config to the sensor");
    this.configPublisher.publish(JSON.stringify(config));
  }

  restoreConfig() {
    log.info("Restoring temporary sensor config");
    this.configPublisher.publish(JSON.stringify(this.config));
  }

  saveConfig(config) {
    log.info("Saving config to the database");
    this.configPublisher.publish(JSON.stringify(config));
    this.config = config;

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
        this.config = res;
        resolve(res);
      });
    });
  }
}

module.exports = ConfigService;
