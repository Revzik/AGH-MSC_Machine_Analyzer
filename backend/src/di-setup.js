const awilix = require("awilix");

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

function setup() {
  const Logging = require("./log/logger");
  const log = new Logging().createLogger(__filename);
  log.info("Starting Machine Analyzer backend");
  log.info("Registering dependencies...");
  container.register({ logging: awilix.asClass(Logging) });

  const DataModel = require("./data/dataModel");
  const { ConfigModel, defaultId } = require("./data/configModel");

  const DataService = require("./service/dataService");
  const ConfigService = require("./service/configService");
  const AcquisitionService = require("./service/acquisitionService");

  const DataMqtt = require("./mqtt/dataMqtt");
  const ConfigMqtt = require("./mqtt/configMqtt");
  const AcquisitionMqtt = require("./mqtt/acquisitionMqtt");

  const MqttDispatcher = require("./mqtt/mqttDispatcher");

  container.register({
    dataModel: awilix.asValue(DataModel),
    configModel: awilix.asValue(ConfigModel),
    configId: awilix.asValue(defaultId),
    dataService: awilix.asClass(DataService),
    configService: awilix.asClass(ConfigService),
    acquisitionService: awilix.asClass(AcquisitionService),
    dataMqtt: awilix.asClass(DataMqtt, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    configMqtt: awilix.asClass(ConfigMqtt, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    acquisitionMqtt: awilix.asClass(AcquisitionMqtt),
    mqttDispatcher: awilix.asClass(MqttDispatcher),
  });
}

module.exports = { container, setup };
