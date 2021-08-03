const { container } = require("../../di-setup");
const log = container.resolve("logging").createLogger(__filename);
log.info("Setting up config MQTT publisher");

class AcquisitionMqtt {

}

module.exports = AcquisitionMqtt;
