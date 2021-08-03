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

  const DataMqtt = require("./mqtt/dataMqtt");
  const DataModel = require("./data/dataModel");
  const DataService = require("./service/dataService");
  const ConfigMqtt = require("./mqtt/configMqtt");
  const { ConfigModel, defaultId } = require("./data/configModel");
  const ConfigService = require("./service/configService");
  const AcquisitionMqtt = require("./mqtt/acquisitionMqtt");
  const AcquisitionService = require("./service/acquisitionService");
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
    acquisitionMqtt: awilix.asClass(AcquisitionMqtt),
    acquisitionService: awilix.asClass(AcquisitionService),
    mqttDispatcher: awilix.asClass(MqttDispatcher),
  });

  if (dummy) {
    const DummyDataMqtt = require("./mqtt/dummy/dummyDataMqtt");
    const DummyConfigMqtt = require("./mqtt/dummy/dummyConfigMqtt");
    const DummyAcquisitionMqtt = require("./mqtt/dummy/dummyAcquisitionMqtt");

    container.register({
      dummyData: awilix.asClass(DummyDataMqtt),
      dummyConfig: awilix.asClass(DummyConfigMqtt),
      dummyAcquisition: awilix.asClass(DummyAcquisitionMqtt),
    })
  }
}

module.exports = { container, setup };
