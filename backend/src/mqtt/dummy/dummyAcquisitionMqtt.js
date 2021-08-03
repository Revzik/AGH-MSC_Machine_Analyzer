const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up dummy MQTT acquisition subscriber");

class DummyAcquisitionMqtt {
  constructor({ dummyData }) {
    this.dummyData = dummyData;

    this.client = null;
    this.initialized = false;
  }

  init(client) {
    this.client = client;
    this.initialized = true;

    this.client.subscribe("acquisition", (err) => {
      if (err) {
        log.error("Error during acquisition subscribe");
        log.error(err);
      }

      this.initialized = false;
    });
  }

  process(message) {
    log.info(`Message "${message}" received`);
    switch (message) {
      case "start":
        this.dummyData.start();
        break;
      case "stop":
        this.dummyData.stop();
        break;
      case "start_capture":
        this.dummyData.startCapture();
        break;
      case "stop_capture":
        this.dummyData.stopCapture();
        break;
      default:
        log.error("Unknown message received");
    }
  }
}

module.exports = DummyAcquisitionMqtt;
