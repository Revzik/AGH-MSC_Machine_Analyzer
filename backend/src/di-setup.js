const awilix = require("awilix");

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

function setup(dummy) {
  const Logging = require("./log/logger");
  const log = new Logging().createLogger(__filename);
  log.info("Starting Machine Analyzer backend");
  log.info("Registering dependencies...");
  container.register({ logging: awilix.asClass(Logging) });

  const DataModel = require("./data/dataModel");
  const DataService = require("./service/dataService");
  const { ConfigModel, defaultId } = require("./data/configModel");
  const ConfigService = require("./service/configService");
  const AcquisitionService = require("./service/acquisitionService");

  let DataMQTT = undefined;
  let ConfigMQTT = undefined;
  if (dummy) {
    log.info("App working in dummy mode");
    DataMQTT = require("./mqtt/dummy/dataMQTT");
    ConfigMQTT = require("./mqtt/dummy/configMQTT");
  }

  container.register({
    dataModel: awilix.asValue(DataModel),
    dataMQTT: awilix.asClass(DataMQTT, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    dataService: awilix.asClass(DataService),
    configModel: awilix.asValue(ConfigModel),
    configId: awilix.asValue(defaultId),
    configMQTT: awilix.asClass(ConfigMQTT, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    configService: awilix.asClass(ConfigService),
    acquisitionService: awilix.asClass(AcquisitionService),
  });
}

module.exports = { container, setup };
