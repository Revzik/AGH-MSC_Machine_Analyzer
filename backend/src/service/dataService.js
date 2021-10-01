const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up data service");

const { PythonShell } = require("python-shell");

class DataService {
  constructor({
    acquisitionService,
    configService,
    calibrationService,
    dataModel,
  }) {
    this.acquisitionService = acquisitionService;
    this.configService = configService;
    this.calibrationService = calibrationService;

    this.dataModel = dataModel;

    this.rawData = {
      t0: 0,
      dt: 0,
      nt: 0,
      t: [],
      x: [],
      y: [],
      z: [],
      f: [],
      ft: [],
    };

    this.data = {
      f: 0,
      x: {
        rms: 0,
        peak: 0,
        kurtosis: 0,
        crestFactor: 0,
        orderSpectrum: [],
      },
      y: {
        rms: 0,
        peak: 0,
        kurtosis: 0,
        crestFactor: 0,
        orderSpectrum: [],
      },
      z: {
        rms: 0,
        peak: 0,
        kurtosis: 0,
        crestFactor: 0,
        orderSpectrum: [],
      },
      orders: [],
    };
  }

  processData(data) {
    this.processRawData(data);

    if (this.calibrationService.isRunning()) {
      this.calibrationService.checkCalibration(this.rawData);
      return;
    }

    const acquisitionStatus = this.acquisitionService.getStatus();
    if (acquisitionStatus.analyzing) {
      this.analyzeData(data);

      if (acquisitionStatus.capturing) {
        this.save(acquisitionStatus.label);
      }
    }
  }

  processRawData(data) {
    const options = {
      mode: "text",
      pythonPath: __dirname + "/../../venv/Scripts/python.exe",
      scriptPath: __dirname + "/../scripts",
    };
    const pyshell = new PythonShell("process_raw.py", options);

    const msg = {
      data: data,
      cal: this.calibrationService.getCalibration(),
    };

    pyshell.send(JSON.stringify(msg));
    pyshell.on("message", (message) => {
      this.rawData = JSON.parse(message);
    });
    pyshell.end((err) => {
      if (err) {
        throw err;
      }
      log.info("Raw data processed!");
    });
  }

  analyzeData(data) {
    const options = {
      mode: "text",
      pythonPath: __dirname + "/../../venv/Scripts/python.exe",
      scriptPath: __dirname + "/../scripts",
    };
    const pyshell = new PythonShell("analyze.py", options);

    const msg = {
      data: data,
      cal: this.calibrationService.getCalibration(),
      config: this.configService.getConfig(),
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

  save(label) {
    const newDataModel = new this.dataModel({
      label: label,
      ...this.data,
    });
    newDataModel.save((err) => {
      if (err) {
        log.error("Error while saving data!");
        log.error(err);
        return;
      }
      log.info("Data saved");
    });
  }

  getRawData() {
    return this.rawData;
  }

  getData() {
    return this.data;
  }
}

module.exports = DataService;
