const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up data service");

class DataService {
  constructor({ dataModel, dataMQTT }) {
    this.dataModel = dataModel;
    this.dataMQTT = dataMQTT;

    this.capturing = false;
    this.label = null;
  }

  strip(number) {
    return parseFloat(parseFloat(number).toPrecision(7));
  }

  getData() {
    log.debug("Sending data");
    let data = this.dataMQTT.getData()
    let { order0, dOrder, spectrum } = data.orderSpectrum;

    let currentOrder = order0;
    let orders = [];
    for (let i = 0; i < spectrum.length; i++) {
      orders.push(this.strip(currentOrder));
      currentOrder += dOrder;
    }

    return { ...data, orderSpectrum: { x: orders, y: spectrum } };
  }

  startCapturing(newLabel) {
    this.dataMQTT.startCapturing(newLabel);
  }

  stopCapturing() {
    this.dataMQTT.stopCapturing();
  }

  startAcquisition() {
    this.dataMQTT.startAcquisition();
  }

  stopAcquisition() {
    this.dataMQTT.stopAcquisition();
  }
}

module.exports = DataService;
