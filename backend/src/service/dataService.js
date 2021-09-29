const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up data service");

const { PythonShell } = require("python-shell");

function strip(number) {
  return parseFloat(parseFloat(number).toPrecision(7));
}

class DataService {
  constructor({ acquisitionService, dataModel, configService }) {
    this.acquisitionService = acquisitionService;
    this.dataModel = dataModel;
    this.configService = configService;

    this.rawData = {
      t0: 0,
      dt: 0,
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
      orders: []
    };
  }

  processData(data) {
    this.setRawData(data);
    this.analyzeData(data);
  }

  setRawData(data) {
    let t = [];
    let curT = 0;
    for (let i = 0; i < data.x.length; i++) {
      t.push(curT);
      curT += data.dt;
    }
    data["t"] = t;
    this.rawData = data;
  }

  analyzeData(data) {
    const pyshell = new PythonShell(__dirname + "/../scripts/analyze.py");

    let msg = {
      data: data,
      config: this.configService.getConfig(),      
    }

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

  save() {
    const acquisitionStatus = this.acquisitionService.getStatus();

    if (acquisitionStatus.capturing) {
      const newDataModel = new this.dataModel({
        label: acquisitionStatus.label,
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
  }

  getRawData() {
    return this.rawData;
  }

  getData() {
    return this.data;
  }
}

module.exports = DataService;
