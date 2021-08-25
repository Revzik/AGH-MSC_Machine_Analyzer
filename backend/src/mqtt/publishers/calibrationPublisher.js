const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up calibration MQTT publisher");

class CalibrationPublisher {
  constructor() {
    this.publishCallback = null;
    this.initialized = false;

    this.topic = "sensor/calibration/new";
  }

  init(publishCallback) {
    this.publishCallback = publishCallback;
    this.initialized = true;
  }

  getTopic() {
    return this.subscribeTopic;
  }

  publish(message) {
    this.publishCallback(this.topic, message, { retain: true, qos: 2 });
  }
}

module.exports = CalibrationPublisher;
