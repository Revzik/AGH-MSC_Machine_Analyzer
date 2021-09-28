const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up acquisition service");

class AcquisitionService {
  constructor() {
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
    if (!this.capturing) {
      log.warn("Capturing already stopped!");
      return;
    }
    this.capturing = false;
  }

  startAcquisition() {
    if (this.acquiring) {
      log.warn("Acquisition already started!");
      return;
    }
    this.acquiring = true;
  }

  stopAcquisition() {
    if (!this.acquiring) {
      log.warn("Acquisition already stopped!");
      return;
    }
    if (this.capturing) {
      this.capturing = false;
    }
    this.acquiring = false;
  }
}

module.exports = AcquisitionService;
