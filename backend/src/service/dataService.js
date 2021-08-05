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

    this.data = {
      frequency: 0,
      rms: 0,
      kurtosis: 0,
      peakFactor: 0,
      orderSpectrum: {
        order0: 0,
        dOrder: 0,
        spectrum: [],
      },
    };
  }

  porocessData(data) {
    log.debug("Sending data");
    let { order0, dOrder, spectrum } = data.orderSpectrum;

    let currentOrder = order0;
    let orders = [];
    for (let i = 0; i < spectrum.length; i++) {
      orders.push(strip(currentOrder));
      currentOrder += dOrder;
    }

    this.data = { ...data, orderSpectrum: { x: orders, y: spectrum } };
    this.save();
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

  getData() {
    return this.data;
  }
}

module.exports = DataService;
