const log = require("../log/logger")(__filename);
log.info("Setting up MQTT dispatcher");

const mqtt = require("mqtt");

const PUB_CONFIG = "sensor/config";
const SUB_DATA = "sensor/data";

// Client setup

client = mqtt.connect(process.env.MQTT_URL, {
  clientId: "analyzerBackend",
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
});

client.on("connect", () => {
  log.info("Connected to the MQTT broker");
});

client.on("error", (error) => {
  log.error("Could not connect to the broker");
  log.error(error);
  process.exit(1);
});

client.on("message", (topic, message, packet) => {
  log.debug(`Received message on topic ${topic}`);
  dispatch(topic, message, packet);
});

// Functions

const dispatch = (topic, message, packet) => {
  switch (topic) {
    case SUB_DATA:
      this.dataSubscriber.process(message); // TODO: Update with dataService.processData(JSON.parse(message.toString()));
      break;
    default:
      log.error(`Unknown subscriber topic ${topic}`);
  }
};

const publishConfig = (config) => {
  client.publish(PUB_CONFIG, JSON.stringify(config), { retain: true, qos: 2 });
};

// Exports

module.exports = { publishConfig };
