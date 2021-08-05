const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up data service");

function strip(number) {
  return parseFloat(parseFloat(number).toPrecision(7));
}

class DataService {
  constructor() {}

  porocessData(data) {
    log.debug("Sending data");
    let { order0, dOrder, spectrum } = data.orderSpectrum;

    let currentOrder = order0;
    let orders = [];
    for (let i = 0; i < spectrum.length; i++) {
      orders.push(strip(currentOrder));
      currentOrder += dOrder;
    }

    return { ...data, orderSpectrum: { x: orders, y: spectrum } };
  }
}

module.exports = DataService;
