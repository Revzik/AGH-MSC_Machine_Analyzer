const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up calibration service");

const { PythonShell } = require("python-shell");

class CalibrationService {
  constructor({ calibrationModel, acquisitionService, configService }) {
    this.calibrationModel = calibrationModel;
    this.acquisitionService = acquisitionService;
    this.configService = configService;

    this.isChecking = false;
    this.isCalibrating = false;

    this.data = {
      x: 0,
      y: 0,
      z: 0,
    };

    this.cal = {
      sensitivity: {
        x: 1,
        y: 1,
        z: 1,
      },
      offset: {
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
    const options = {
      mode: "text",
      pythonPath: __dirname + "/../../venv/Scripts/python.exe",
      scriptPath: __dirname + "/../scripts",
    };
    const pyshell = new PythonShell("calibration_check.py", options);

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
      log.info("Calibration check data processed!");
    });
  }

  calibrate(data) {
    const options = {
      mode: "text",
      pythonPath: __dirname + "/../../venv/Scripts/python.exe",
      scriptPath: __dirname + "/../scripts",
    };
    const pyshell = new PythonShell("calibrate.py", options);

    pyshell.send(JSON.stringify(data));
    pyshell.on("message", (message) => {
      this.saveCalibration(JSON.parse(message));
    });
    pyshell.end((err) => {
      if (err) {
        throw err;
      }
      log.info("Calibration data processed!");
    });
  }

  startCheck() {
    this.isChecking = true;
    this.start();
  }

  startCalibration() {
    this.isCalibrating = true;
    this.cal = {
      sensitivity: {
        x: 1,
        y: 1,
        z: 1,
      },
      offset: {
        x: 0,
        y: 0,
        z: 0,
      },
    };
    this.start();
  }

  start() {
    this.acquisitionService.stopAnalysis();
    const config = JSON.parse(JSON.stringify(this.configService.getConfig()));
    config["windowLength"] = 100;
    config["averages"] = 1;
    this.configService.sendConfig(config);
  }

  stop() {
    this.configService.restoreConfig();
    if (this.isCalibrating) {
      this.loadCalibration();
    }

    this.isChecking = false;
    this.isCalibrating = false;
  }

  isRunning() {
    return this.isChecking || this.isCalibrating;
  }

  saveCalibration(cal) {
    log.info("Saving calibration to the database");
    this.cal = cal;

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
