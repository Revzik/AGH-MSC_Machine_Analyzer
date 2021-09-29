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

    this.debugData = {
      timestamp: 0,
      fft: {
        x: [],
        y: [],
        z: [],
        t0: 0,
        dt: 1,
        nt: 0,
      },
      order: {
        x: [],
        y: [],
        z: [],
        t0: 0,
        dt: 1,
        nt: 0,
      },
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
    let t = [];
    let curT = 0;
    for (let i = 0; i < data.x.length; i++) {
      t.push(curT);
      curT += data.dt;
    }
    data["t"] = t;
    this.rawData = data;
  }

  processDebugData(data) {
    let orderT = [];
    let orderTi = data.order.t0;
    for (let i = 0; i < data.order.nt; i++) {
      orderT.push(orderTi);
      orderTi += data.order.dt;
    }
    data.order["t"] = orderT;

    let fftT = [];
    let fftTi = data.fft.t0;
    for (let i = 0; i < data.fft.nt; i++) {
      fftT.push(fftTi);
      fftTi += data.fft.dt;
    }
    data.fft["t"] = fftT;

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
