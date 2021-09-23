const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up debug MQTT data subscriber");

class DebugDataSubscriber {
  constructor({ dataService }) {
    this.dataService = dataService;
    this.initialized = false;

    this.topic = "sensor/data/debug";
  }

  init(subscribeCallback) {
    subscribeCallback(this.topic);
    this.initialized = true;
  }

  getTopic() {
    return this.topic;
  }

  process(message) {
    this.dataService.processDebugData(JSON.parse(message.toString()));
  }
}

module.exports = DebugDataSubscriber;
