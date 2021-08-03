const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up acquisition service");

class AcquisitionService {
  constructor({ dataMqtt }) {
    this.dataMqtt = dataMqtt;

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
    this.dataMqtt
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
    this.dataMqtt
      .stopCapturing()
      .then(() => {
        this.capturing = false;
      })
      .catch(() => {
        this.capturing = true;
      });
  }

  startAcquisition() {
    this.dataMqtt
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
    this.dataMqtt
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
