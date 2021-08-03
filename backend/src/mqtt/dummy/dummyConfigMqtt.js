const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up dummy MQTT config subscriber");

class DummyConfigMqtt {
  
}

module.exports = DummyConfigMqtt;
