const awilix = require("awilix");

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

const Logging = require("./log/logger");
const log = new Logging().createLogger(__filename);
log.info("Starting Machine Analyzer backend");
log.info("Registering dependencies...");
container.register({ logging: awilix.asClass(Logging) });

module.exports = container;
