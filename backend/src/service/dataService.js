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
      t: [0, 0.1, 0.2, 0.3, 0.4],
      x: [1, 0, -1, 0, 1],
      y: [2, -1, 3, -1, 2],
      z: [0, 3, -2, 3, -1],
    };

    this.debugData = {
      t: [0, 0.1, 0.2, 0.3, 0.4],
      f: [2, 2, 2, 2, 2],
      x: [1, 0, -1, 0, 1],
      y: [2, -1, 3, -1, 2],
      z: [0, 3, -2, 3, -1],
    };

    this.data = {
      frequency: 0,
      x: {
        rms: 0,
        kurtosis: 0,
        peakFactor: 0,
        orderSpectrum: {
          x: [0, 1, 2, 3],
          y: [0, 1, 2, 3],
        },
      },
      y: {
        rms: 0,
        kurtosis: 0,
        peakFactor: 0,
        orderSpectrum: {
          x: [0, 1, 2, 3],
          y: [2, 3, 2, 3],
        },
      },
      z: {
        rms: 0,
        kurtosis: 0,
        peakFactor: 0,
        orderSpectrum: {
          x: [0, 1, 2, 3],
          y: [4, 3, 2, 1],
        },
      },
    };
  }

  processRawData(data) {
    this.rawData = data;
  }

  processData(data) {
    let t = [];
    for (let i = 0; i < data.f.length; i++) {
      t.push(i);
    }
    data["t"] = t;
    this.debugData = data;
    // this.save(data);

    // data.x.orderSpectrum = this.processSpectrum(data.x.orderSpectrum);
    // data.y.orderSpectrum = this.processSpectrum(data.y.orderSpectrum);
    // data.z.orderSpectrum = this.processSpectrum(data.z.orderSpectrum);

    // this.data = data;
  }

  processSpectrum(orderSpectrum) {
    let { order0, dOrder, spectrum } = orderSpectrum;

    let currentOrder = order0;
    let orders = [];
    for (let i = 0; i < spectrum.length; i++) {
      orders.push(strip(currentOrder));
      currentOrder += dOrder;
    }

    return { x: orders, y: spectrum };
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

  getDebugData() {
    return this.debugData;
  }

  getData() {
    return this.data;
  }
}

module.exports = DataService;
