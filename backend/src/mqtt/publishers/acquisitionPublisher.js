const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up config MQTT publisher");

class AcquisitionPublisher {
  constructor() {
    this.publishCallback = null;
    this.initialized = false;
    
    this.topic = "sensor/acquisition";
  }

  init(publishCallback) {
    this.publishCallback = publishCallback;
    this.initialized = true;
  }

  getTopic() {
    return this.topic;
  }

  publish(message) {
    this.publishCallback(this.topic, message, { retain: true, qos: 2 });
  }
}

module.exports = AcquisitionPublisher;
