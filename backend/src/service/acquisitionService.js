const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up acquisition service");

class AcquisitionService {
  constructor() {
    this.analyzing = false;
    this.capturing = false;
    this.label = null;
  }

  getStatus() {
    return {
      analyzing: this.analyzing,
      capturing: this.capturing,
      label: this.label,
    };
  }

  startAnalysis() {
    // Add calibration stop when removing classes
    this.analyzing = true;
  }

  stopAnalysis() {
    this.stopCapturing();
    this.analyzing = false;
  }

  startCapturing(newLabel) {
    this.capturing = true;
    this.label = newLabel;
  }

  stopCapturing() {
    this.capturing = false;
  }
}

module.exports = AcquisitionService;
