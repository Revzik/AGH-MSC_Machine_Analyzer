const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up acquisition service");

class AcquisitionService {
  constructor({ acquisitionMqtt }) {
    this.acquisitionMqtt = acquisitionMqtt;

    this.acquiring = false;
    this.capturing = false;
    this.label = null;
  }

  getStatus() {
    return {
      acquiring: this.acquiring,
      capturing: this.capturing,
      label: this.label,
    };
  }

  startCapturing(newLabel) {
    this.capturing = true;
    this.label = newLabel;
  }

  stopCapturing() {
    this.capturing = false;
  }

  startAcquisition() {
    this.acquisitionMqtt.publish("start");
    this.acquiring = true;
  }

  stopAcquisition() {
    if (this.capturing) {
      this.capturing = false;
    }
    this.acquisitionMqtt.publish("stop");
    this.acquiring = false;
  }
}

module.exports = AcquisitionService;
