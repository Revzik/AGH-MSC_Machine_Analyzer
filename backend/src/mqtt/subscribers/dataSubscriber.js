const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up MQTT data subscriber");

class DataSubscriber {
  constructor({ dataService }) {
    this.dataService = dataService;
    this.initialized = false;

    this.topic = "sensor/data/processed";
  }

  init(subscribeCallback) {
    subscribeCallback(this.topic);
    this.initialized = true;
  }

  getTopic() {
    return this.topic;
  }

  process(message) {
    this.dataService.processData(JSON.parse(message.toString()));
  }
}

module.exports = DataSubscriber;
