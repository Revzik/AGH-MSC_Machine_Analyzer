const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up calibration service");

class CalibrationService {
  constructor({ acquisitionService }) {
    this.acquisitionService = acquisitionService;

    this.running = false;

    this.data = {
      x: 0,
      y: 0,
      z: 0,
    }

    this.calA = {
      x: 1,
      y: 1,
      z: 1,
    };
    this.calB = {
      x: 0,
      y: 0,
      z: 0,
    }
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  getCalibration() {
    return {
      a: this.calA,
      b: this.calB,
    }
  }

  setCalibration(calA, calB) {
    this.calA = calA;
    this.calB = calB;
  }

  startCheck() {
    if (this.running) {
      log.info("Calibration already started!");
      return;
    }
    this.running = true;
  }

  stopCheck() {
    if (!this.running) {
      log.info("Calibration already started!");
      return;
    }
    this.running = false;
  }

  startCalibration() {
    if (this.running) {
      log.info("Calibration already started!");
      return;
    }
    this.running = true;
  }

  stopCalibration() {
    if (!this.running) {
      log.info("Calibration already stopped!");
      return;
    }
    this.running = false;
  }
}

module.exports = CalibrationService;
