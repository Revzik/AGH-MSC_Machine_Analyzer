const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up calibration service");

class CalibrationService {
  constructor({ calibrationPublisher, acquisitionService }) {
    this.calibrationPublisher = calibrationPublisher;
    this.acquisitionService = acquisitionService;

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

  startCalibration() {
    this.acquisitionService.stopAcquisition();
    this.calibrationPublisher.publish("start");
  }

  stopCalibration() {
    this.calibrationPublisher.publish("stop");
  }

  saveData(data) {
    return this.calibrationPublisher.publish(JSON.stringify(data));
  }
}

module.exports = CalibrationService;
