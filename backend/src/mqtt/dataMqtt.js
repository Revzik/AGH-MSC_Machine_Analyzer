const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up MQTT data subscriber");

class DataMqtt {

}

module.exports = DataMqtt;
