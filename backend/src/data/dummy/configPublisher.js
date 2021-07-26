const log = require("#log/logger").createLogger(__filename);
log.info("Setting up config publisher");

function sendConfig(config) {
  log.info("Sending new config")
}

module.exports = sendConfig;
