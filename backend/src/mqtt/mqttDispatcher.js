const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up MQTT dispatcher");

class MqttDispatcher {
  constructor({ configMqtt, dataMqtt }) {
    this.configMqtt = configMqtt;
    this.dataMqtt = dataMqtt;

    this.initialized = false;
  }

  init() {
    this.configMqtt.init();
    this.dataMqtt.init();
    this.initialized = true;
  }

  isInitialized() {
    return this.initialized;
  }

  
}

module.exports = MqttDispatcher;
