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
  currenntData = data;
}

function getData() {
  let { order0, dOrder, y } = currentData.orderSpectrum;

  let currentX = order0;
  let x = [];
  for (let i = 0; i < y.length; i++) {
    x.push(strip(currentX));
    currentX += dOrder;
  }

  return { ...currentData, orderSpectrum: { x: x, y: y } };
}

module.exports = {
  setData,
  getData,
};
