const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up acquisition service");

class AcquisitionService {
  constructor({ dataMQTT }) {
    this.dataMQTT = dataMQTT;

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
    this.dataMQTT
      .startCapturing(newLabel)
      .then(() => {
        this.capturing = true;
        this.label = newLabel;
      })
      .catch(() => {
        this.capturing = false;
      });
  }

  stopCapturing() {
    this.dataMQTT
      .stopCapturing()
      .then(() => {
        this.capturing = false;
      })
      .catch(() => {
        this.capturing = true;
      });
  }

  startAcquisition() {
    this.dataMQTT
      .startAcquisition()
      .then(() => {
        this.acquiring = true;
      })
      .catch(() => {
        this.acquiring = false;
      });
  }

  stopAcquisition() {
    if (this.capturing) {
      this.stopCapturing()
    }
    this.dataMQTT
      .stopAcquisition()
      .then(() => {
        this.acquiring = false;
      })
      .catch(() => {
        this.acquiring = true;
      });
  }
}

module.exports = AcquisitionService;
