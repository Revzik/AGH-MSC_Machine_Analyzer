const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up dummy MQTT data subscriber");

function strip(number) {
  return parseFloat(parseFloat(number).toPrecision(7));
}

function randomize(amplitude) {
  let min = 0.9 * amplitude;
  let max = 1.1 * amplitude;
  return Math.random() * (max - min) + min;
}

function getOrderSpectrum(max_order, dOrder, orderAmplitudes, noiseAmplitude) {
  let spec = [];
  let nextInt = 0;
  for (let i = 0; i <= max_order; i += dOrder) {
    let rounded = strip(i);
    if (rounded < nextInt) {
      spec.push(randomize(noiseAmplitude));
    } else {
      spec.push(randomize(orderAmplitudes[nextInt]));
      nextInt++;
    }
  }

  return spec;
}

function getDummyData() {
  let dOrder = 0.2;
  let orderAmpl = [0.3, 1.8, 0.4, 1, 0.3, 0.5, 0.3, 0.2, 0.8, 0.2, 0.1];
  let y = getOrderSpectrum(orderAmpl.length - 1, dOrder, orderAmpl, 0.05);

  return {
    frequency: randomize(40),
    rms: randomize(1.8),
    kurtosis: randomize(3),
    peakFactor: randomize(0.7),
    orderSpectrum: {
      order0: 0,
      dOrder: dOrder,
      spectrum: y,
    },
  };
}

class DataMqtt {
  constructor({ dataModel }) {
    this.dataModel = dataModel;

    this.timerId = null;

    this.capturing = false;
    this.label = "";

    this.currentData = {
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

  startAcquisition() {
    return new Promise((resolve, reject) => {
      log.info("Starting up dummy data generator");

      this.timerId = setInterval(() => {
        log.debug("Generating data...");
        this.currentData = getDummyData();

        if (this.capturing) {
          this.saveData();
        }
      }, 5000);

      resolve();
    });
  }

  saveData() {
    log.info(`Saving ${this.label}...`);

    const newData = new this.dataModel({
      label: this.label,
      ...this.currentData,
    });
    newData.save((err) => {
      if (err) {
        log.error("Error while saving data!");
        log.error(err);
        return;
      }
      log.info("Data saved");
    });
  }

  getData() {
    return this.currentData;
  }

  stopAcquisition() {
    return new Promise((resolve, reject) => {
      log.info("Stopping dummy data generator");

      clearInterval(this.timerId);
      resolve();
    });
  }

  startCapturing(newLabel) {
    return new Promise((resolve, reject) => {
      log.info(`Starting dummy capture with label: ${newLabel}`);

      this.label = newLabel;
      this.capturing = true;
      resolve();
    });
  }

  stopCapturing() {
    return new Promise((resolve, reject) => {
      log.info("Stopping dummy capture");

      this.label = "";
      this.capturing = false;
      resolve();
    });
  }
}

module.exports = DataMqtt;
