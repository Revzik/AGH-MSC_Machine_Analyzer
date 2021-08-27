const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up raw MQTT data subscriber");

class RawDataSubscriber {
  constructor({ dataService }) {
    this.dataService = dataService;
    this.initialized = false;

    this.topic = "sensor/data/raw";
  }

  init(subscribeCallback) {
    subscribeCallback(this.topic);
    this.initialized = true;
  }

  getTopic() {
    return this.topic;
  }

  process(message) {
    this.dataService.processRawData(JSON.parse(message.toString()));
  }
}

module.exports = RawDataSubscriber;