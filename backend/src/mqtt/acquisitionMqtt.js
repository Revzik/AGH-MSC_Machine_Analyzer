const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up config MQTT publisher");

class AcquisitionMqtt {
  constructor() {
    this.publishCallback = null;
    this.initialized = false;
  }

  init(publishCallback) {
    this.publishCallback = publishCallback;
    this.initialized = true;
  }

  publish(message) {
    this.publishCallback("sensor/acquisition", message, { retain: true, qos: 1 });
  }

  process(message) {
    log.warn("Acquisition MQTT currently cannot receive messages");
  }
}

module.exports = AcquisitionMqtt;
