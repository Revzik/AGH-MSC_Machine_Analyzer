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
      t: [],
      x: [],
      y: [],
      z: [],
    };

    this.debugData = {
      t: [],
      f: [],
      x: [],
      y: [],
      z: [],
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

  processRawData(data) {
    this.rawData = data;
  }

  processDebugData(data) {
    let t = [];
    let ti = data.t0;
    for (let i = 0; i < data.nt; i++) {
      t.push(ti);
      ti += data.dt;
    }
    data["t"] = t;
    this.debugData = data;
  }

  processData(data) {
    this.save(data);

    data.x.orderSpectrum = this.processSpectrum(data.x.orderSpectrum);
    data.y.orderSpectrum = this.processSpectrum(data.y.orderSpectrum);
    data.z.orderSpectrum = this.processSpectrum(data.z.orderSpectrum);

    this.data = data;
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
