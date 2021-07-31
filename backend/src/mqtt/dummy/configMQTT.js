const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up config publisher");

class ConfigMQTT {
  publishConfig(config) {
    log.info("Publishing new config!");
    log.debug(JSON.stringify(config));
  }
}

module.exports = ConfigMQTT;
