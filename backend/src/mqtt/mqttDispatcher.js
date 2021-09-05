const { container } = require("../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up MQTT dispatcher");

const mqtt = require("mqtt");

class MqttDispatcher {
  constructor({ rawDataSubscriber, dataSubscriber, calibrationSubscriber, configPublisher, acquisitionPublisher, calibrationPublisher }) {
    this.rawDataSubscriber = rawDataSubscriber;
    this.dataSubscriber = dataSubscriber;
    this.calibrationSubscriber = calibrationSubscriber;

    this.configPublisher = configPublisher;
    this.acquisitionPublisher = acquisitionPublisher;
    this.calibrationPublisher = calibrationPublisher;

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

      this.rawDataSubscriber.init(this.subscribe);
      this.dataSubscriber.init(this.subscribe);
      this.calibrationSubscriber.init(this.subscribe);

      this.configPublisher.init(this.publish);
      this.acquisitionPublisher.init(this.publish);
      this.calibrationPublisher.init(this.publish);

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
      log.debug(`Message: ${message}`)
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
      case this.rawDataSubscriber.getTopic():
        this.rawDataSubscriber.process(message);
        break;
      case this.dataSubscriber.getTopic():
        this.dataSubscriber.process(message);
        break;
      case this.calibrationSubscriber.getTopic():
        this.calibrationSubscriber.process(message);
        break;
      default:
        log.error(`Unknown subscriber topic ${topic}`);
    }
  }
}

module.exports = MqttDispatcher;
