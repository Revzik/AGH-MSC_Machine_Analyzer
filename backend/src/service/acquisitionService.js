const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up acquisition service");

class AcquisitionService {
  constructor() {
    this.acquiring = false;
    this.label = null;
  }

  getStatus() {
    return {
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
}

module.exports = AcquisitionService;
