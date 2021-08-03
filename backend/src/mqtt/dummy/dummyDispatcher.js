const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up dummy MQTT message dispatcher");

class DummyMqttDispatcher {
  constructor({ dummyData, dummyConfig, dummyAcquisition }) {
    this.dummyData = dummyData;
    this.dummyConfig = dummyConfig;
    this.dummyAcquisition = dummyAcquisition;

    this.client = null;
    this.initialized = false;
  }

  init(client) {
    this.dummyData.init(client);
    this.dummyConfig.init(client);
    this.dummyAcquisition.init(client);

    this.client = client;
    this.initialized = true;
  }

  dispatch(topic, message) {
    switch (topic) {
      case "data":
        this.dummyData.process(message);
        break;
      case "config":
        this.dummyConfig.process(message);
        break;
      case "acquisition":
        this.dummyAcquisition.process(message);
        break;
      default:
        log.error(`Unknown topic ${topic}`)
    }
  }
}

module.exports = DummyMqttDispatcher;
