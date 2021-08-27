const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up MQTT data subscriber");

class CalibrationSubscriber {
  constructor({ calibrationService }) {
    this.calibrationService = calibrationService;
    this.initialized = false;
    
    this.topic = "sensor/calibration/data";
  }

  init(subscribeCallback) {
    subscribeCallback(this.topic);
    this.initialized = true;
  }

  getTopic() {
    return this.topic;
  }

  process(message) {
    this.calibrationService.setData(JSON.parse(message.toString()));
  }
}

module.exports = CalibrationSubscriber;
