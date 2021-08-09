const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up MQTT dispatcher");

const mqtt = require("mqtt");

class MqttDispatcher {
  constructor({ dataMqtt, configMqtt, acquisitionMqtt }) {
    this.dataMqtt = dataMqtt;
    this.configMqtt = configMqtt;
    this.acquisitionMqtt = acquisitionMqtt;

    this.publish = this.internalPublish.bind(this);
    this.subscribe = this.internalSubscribe.bind(this);

    this.client = null;
    this.initialized = false;
  }

  init() {
    this.client = mqtt.connect(process.env.MQTT_URL, {
      clientId: "analyzerBackend",
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD,
    });

    this.client.on("connect", () => {
      log.info("Connected to the MQTT broker");

      this.dataMqtt.init(this.publish, this.subscribe);
      this.configMqtt.init(this.publish, this.subscribe);
      this.acquisitionMqtt.init(this.publish, this.subscribe);

      this.initialized = true;
    });

    this.client.on("error", (error) => {
      log.error("Could not connect to the broker");
      log.error(error);
      this.initialized = false;
      process.exit(1);
    });

    this.client.on("message", (topic, message, packet) => {
      this.dispatch(topic, message, packet);
    });
  }

  internalPublish(topic, message, options) {
    if (this.client.connected) {
      log.info(`Publishing to topic: ${topic}`);
      this.client.publish(topic, message, options);
    }
  }

  internalSubscribe(topic) {
    if (this.client.connected) {
      log.info(`Subscribing to topic: ${topic}`);
      this.client.subscribe(topic, (err) => {
        if (err) {
          log.error(`Could not subscribe to topic: ${topic}`);
          log.error(err);
        }
      });
    }
  }

  dispatch(topic, message, packet) {
    switch (topic) {
      case this.dataMqtt.getTopic():
        this.dataMqtt.process(message, packet);
        break;
      case this.configMqtt.getTopic():
        this.configMqtt.process(message, packet);
        break;
      case this.acquisitionMqtt.getTopic():
        this.acquisitionMqtt.process(message, packet);
        break;
      default:
        log.error(`Unknown topic ${topic}`);
    }
  }
}

module.exports = MqttDispatcher;
