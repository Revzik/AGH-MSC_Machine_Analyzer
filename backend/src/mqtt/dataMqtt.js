const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up MQTT data subscriber");

class DataMqtt {
  constructor({ dataService }) {
    this.dataService = dataService;

    this.publishCallback = null;
    this.initialized = false;
  }

  init(publishCallback) {
    this.publishCallback = publishCallback;
    this.initialized = true;
  }

  publish(message) {
    log.warn("Data MQTT currently cannot publish messages");
  }

  process(message) {
    this.dataService.processData(JSON.parse(message.toString()));
  }
}

module.exports = DataMqtt;
