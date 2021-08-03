const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up MQTT dispatcher");

class MqttDispatcher {
  constructor({ dataMqtt, configMqtt, acquisitionMqtt }) {
    this.dataMqtt = dataMqtt;
    this.configMqtt = configMqtt;
    this.acquisitionMqtt = acquisitionMqtt;

    this.client = null;
    this.initialized = false;
  }

  init(client) {
    this.dataMqtt.init(client);
    this.configMqtt.init(client);
    this.acquisitionMqtt.init(client);

    this.client = client;
    this.initialized = true;
  }

  dispatch(topic, message) {
    switch (topic) {
      case "data":
        this.dataMqtt.process(message);
        break;
      case "config":
        this.configMqtt.process(message);
        break;
      case "acquisition":
        this.acquisitionMqtt.process(message);
        break;
      default:
        log.error(`Unknown topic ${topic}`)
    }
  }
}

module.exports = MqttDispatcher;
