const log = require("#log/logger").createLogger(__filename);
log.info("Setting up data service");

const { Data } = require("#data/models");

let currentData = {
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

function strip(number) {
  return parseFloat(parseFloat(number).toPrecision(7));
}

function setData(data) {
  log.debug("Received new data!");
  currentData = data;

  if (capturing) {
    log.info(`Saving ${label}...`);
    const dataModel = new Data({ label: label, ...data });
    dataModel.save((err) => {
      if (err) {
        log.error("Error while saving data!");
        log.error(err);
        return;
      }
      log.info("Sucessfully saved data!");
    });
  }
}

function getData() {
  log.debug("Sending data");
  let { order0, dOrder, spectrum } = currentData.orderSpectrum;

  let currentOrder = order0;
  let orders = [];
  for (let i = 0; i < spectrum.length; i++) {
    orders.push(strip(currentOrder));
    currentOrder += dOrder;
  }

  return { ...currentData, orderSpectrum: { x: orders, y: spectrum } };
}

let capturing = false;
let label = null;

function startCapture(newLabel) {
  capturing = true;
  label = newLabel;
}

function stopCapture() {
  capturing = false;
  label = null;
}

module.exports = {
  setData,
  getData,
  startCapture,
  stopCapture,
};
