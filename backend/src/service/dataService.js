const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up data service");

function strip(number) {
  return parseFloat(parseFloat(number).toPrecision(7));
}

class DataService {
  constructor({ acquisitionService, dataModel }) {
    this.acquisitionService = acquisitionService;
    this.dataModel = dataModel;

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
      frequency: 0,
      x: {
        rms: 0,
        kurtosis: 0,
        peakFactor: 0,
        orderSpectrum: {
          x: [],
          y: [],
        },
      },
      y: {
        rms: 0,
        kurtosis: 0,
        peakFactor: 0,
        orderSpectrum: {
          x: [],
          y: [],
        },
      },
      z: {
        rms: 0,
        kurtosis: 0,
        peakFactor: 0,
        orderSpectrum: {
          x: [],
          y: [],
        },
      },
    };
  }

  processData(data) {
    let t = [];
    let curT = 0;
    for (let i = 0; i < data.x.length; i++) {
      t.push(curT);
      curT += data.dt;
    }
    data["t"] = t;
    this.rawData = data;
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
