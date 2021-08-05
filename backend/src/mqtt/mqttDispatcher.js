const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up MQTT dispatcher");

const mqtt = require("mqtt");

class MqttDispatcher {
  constructor({ dataMqtt, configMqtt, acquisitionMqtt }) {
    this.dataMqtt = dataMqtt;
    this.configMqtt = configMqtt;
    this.acquisitionMqtt = acquisitionMqtt;

    this.client = null;
    this.initialized = false;
  }

  init() {
    this.client = mqtt.connect("mqtt://127.0.0.1", {
      clientId: "analyzerBackend",
      username: "analyzer-backend",
      password: ""
    });

    this.client.on("connect", () => {
      log.info("Connected to the MQTT broker");

      this.dataMqtt.init(this.publish);
      this.configMqtt.init(this.publish);
      this.acquisitionMqtt.init(this.publish);

      this.initialized = true;
    });

    this.client.on("error", (error) => {
      log.error("Could not connect to the broker");
      log.error(error);
      this.initialized = false;
      process.exit(1);
    })

    this.client.on("message", (topic, message, packet) => {
      this.dispatch(topic, message, packet);
    })
  }

  publish(topic, message, options) {
    if (this.client.connected) {
      this.client.publish(topic, message, options);
    }
  }

  dispatch(topic, message, packet) {
    switch (topic) {
      case "sensor/data":
        this.dataMqtt.process(message, packet);
        break;
      case "sensor/config":
        this.configMqtt.process(message, packet);
        break;
      case "sensor/acquisition":
        this.acquisitionMqtt.process(message, packet);
        break;
      default:
        log.error(`Unknown topic ${topic}`);
    }
  }
}

module.exports = MqttDispatcher;
