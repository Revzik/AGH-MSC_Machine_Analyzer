const { container } = require("../../di-setup");
const log = container.resolve('logging').createLogger(__filename);
log.info("Setting up config publisher");

class ConfigMQTT {
  sendConfig(config) {
    log.info("Sending new config");
  }
}

module.exports = ConfigMQTT;
