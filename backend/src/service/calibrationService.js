const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up calibration service");

const { PythonShell } = require("python-shell");

class CalibrationService {
  constructor({ calibrationModel, acquisitionService, configService }) {
    this.calibrationModel = calibrationModel;
    this.acquisitionService = acquisitionService;
    this.configService = configService;

    this.running = false;

    this.data = {
      x: 0,
      y: 0,
      z: 0,
    };

    this.cal = {
      a: {
        x: 1,
        y: 1,
        z: 1,
      },
      b: {
        x: 0,
        y: 0,
        z: 0,
      },
    };

    this.loadCalibration();
  }

  getData() {
    return this.data;
  }

  getCalibration() {
    return this.cal;
  }

  setCalibration(cal) {
    this.cal = cal;
  }

  checkCalibration(data) {
    const pyshell = new PythonShell(
      __dirname + "/../scripts/calibration_check.py"
    );

    const msg = {
      x: data.x,
      y: data.y,
      z: data.z,
    };

    pyshell.send(JSON.stringify(msg));
    pyshell.on("message", (message) => {
      this.data = JSON.parse(message);
    });
    pyshell.end((err) => {
      if (err) {
        throw err;
      }
      log.info("Data processed!");
    });
  }

  calibrate(data) {
    const pyshell = new PythonShell(__dirname + "/../scripts/calibrate.py");

    pyshell.send(JSON.stringify(data));
    pyshell.on("message", (message) => {
      this.cal = JSON.parse(message);
      this.saveCalibration(this.cal);
    });
    pyshell.end((err) => {
      if (err) {
        throw err;
      }
      log.info("Data processed!");
    });
  }

  start() {
    this.acquisitionService.stopAnalysis();
    const config = JSON.parse(JSON.stringify(this.configService.getConfig()));
    config["windowLength"] = 100;
    config["averages"] = 1;
    this.configService.sendConfig(config);
    this.running = true;
  }

  stop() {
    this.configService.restoreConfig();
    this.running = false;
  }

  isRunning() {
    return this.running;
  }

  saveCalibration(cal) {
    log.info("Saving calibration to the database");

    return new Promise((resolve, reject) => {
      this.calibrationModel.updateOne({ _id: 1 }, { ...cal }, (err) => {
        if (err) {
          log.error(`Could not update calibration with id 1`);
          reject(err);
          return;
        }
        log.info("Calibration updated");
        resolve();
      });
    });
  }

  loadCalibration() {
    log.info("Loading calibration from the database");
    return new Promise((resolve, reject) => {
      this.calibrationModel.findById(1, (err, res) => {
        if (err) {
          log.error(`Could not fetch calibration with id 1`);
          reject(err);
          return;
        }
        log.info("Fetched calibration from the database");
        this.cal = res;
        resolve(res);
      });
    });
  }
}

module.exports = CalibrationService;
