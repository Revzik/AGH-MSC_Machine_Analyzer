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

  let DataMqtt = undefined;
  let ConfigMqtt = undefined;
  if (dummy) {
    log.info("App working in dummy mode");
    DataMqtt = require("./mqtt/dummy/dataMqtt");
    ConfigMqtt = require("./mqtt/dummy/configMqtt");
  } else {
    DataMqtt = require("./mqtt/dataMqtt");
    ConfigMqtt = require("./mqtt/configMqtt");
  }

  const MqttDispatcher = require("./mqtt/mqttDispatcher");

  container.register({
    dataModel: awilix.asValue(DataModel),
    dataMqtt: awilix.asClass(DataMqtt, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    dataService: awilix.asClass(DataService),
    configModel: awilix.asValue(ConfigModel),
    configId: awilix.asValue(defaultId),
    configMqtt: awilix.asClass(ConfigMqtt, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    configService: awilix.asClass(ConfigService),
    acquisitionService: awilix.asClass(AcquisitionService),
    mqttDispatcher: awilix.asClass(MqttDispatcher),
  });
}

module.exports = { container, setup };
