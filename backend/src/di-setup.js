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
  const CalibrationService = require("./service/calibrationService");

  const DataSubscriber = require("./mqtt/subscribers/dataSubscriber");
  const ConfigPublisher = require("./mqtt/publishers/configPublisher");

  const MqttDispatcher = require("./mqtt/mqttDispatcher");

  container.register({
    dataModel: awilix.asValue(DataModel, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    configModel: awilix.asValue(ConfigModel, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    configId: awilix.asValue(defaultId),
    dataService: awilix.asClass(DataService, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    configService: awilix.asClass(ConfigService, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    acquisitionService: awilix.asClass(AcquisitionService, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    calibrationService: awilix.asClass(CalibrationService, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    dataSubscriber: awilix.asClass(DataSubscriber, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    configPublisher: awilix.asClass(ConfigPublisher, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    mqttDispatcher: awilix.asClass(MqttDispatcher, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
  });
}

module.exports = { container, setup };
