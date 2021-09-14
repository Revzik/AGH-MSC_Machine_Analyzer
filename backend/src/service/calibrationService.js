const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up calibration service");

class CalibrationService {
  constructor({ calibrationPublisher, acquisitionService }) {
    this.calibrationPublisher = calibrationPublisher;
    this.acquisitionService = acquisitionService;

    this.calibrating = false;

    this.data = {
      x: 0,
      y: 0,
      z: 0,
    };
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  startSimpleCalibration() {
    if (this.calibrating) {
      log.info("Calibration already started!");
      return;
    }
    this.calibrating = true;
    this.acquisitionService.stopAcquisition();
    this.calibrationPublisher.publish("start_simple");
  }

  stopCalibration() {
    if (!this.calibrating) {
      log.info("Calibration already stopped!");
      return;
    }
    this.calibrating = false;
    this.calibrationPublisher.publish("stop_simple");
  }

  saveData(data) {
    return this.calibrationPublisher.publish(JSON.stringify(data));
  }
}

module.exports = CalibrationService;
