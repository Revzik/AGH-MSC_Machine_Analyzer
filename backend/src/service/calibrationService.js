const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up calibration service");

class CalibrationService {
  constructor({ calibrationPublisher, acquisitionService }) {
    this.calibrationPublisher = calibrationPublisher;
    this.acquisitionService = acquisitionService;

    this.running = false;

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

  startCheck() {
    if (this.running) {
      log.info("Calibration already started!");
      return;
    }
    this.running = true;
    this.acquisitionService.stopAcquisition();
    this.calibrationPublisher.publish("start_check");
  }

  stopCheck() {
    if (!this.running) {
      log.info("Calibration already started!");
      return;
    }
    this.running = false;
    this.calibrationPublisher.publish("stop_check");
  }

  startCalibration() {
    if (this.running) {
      log.info("Calibration already started!");
      return;
    }
    this.running = true;
    this.acquisitionService.stopAcquisition();
    this.calibrationPublisher.publish("start_cal");
  }

  stopCalibration() {
    if (!this.running) {
      log.info("Calibration already stopped!");
      return;
    }
    this.running = false;
    this.calibrationPublisher.publish("stop_cal");
  }

  sendCalibration(data) {
    return this.calibrationPublisher.publish(JSON.stringify(data));
  }
}

module.exports = CalibrationService;
