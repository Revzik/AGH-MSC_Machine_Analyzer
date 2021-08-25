const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up acquisition service");

class AcquisitionService {
  constructor({ acquisitionPublisher }) {
    this.acquisitionPublisher = acquisitionPublisher;

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
    this.acquisitionPublisher.publish("start");
    this.acquiring = true;
  }

  stopAcquisition() {
    if (this.capturing) {
      this.capturing = false;
    }
    this.acquisitionPublisher.publish("stop");
    this.acquiring = false;
  }
}

module.exports = AcquisitionService;
