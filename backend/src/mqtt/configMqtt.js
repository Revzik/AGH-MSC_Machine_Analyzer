const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up config MQTT publisher");

class ConfigMqtt {

}

module.exports = ConfigMqtt;
