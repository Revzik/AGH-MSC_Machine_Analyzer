# Raspberry Pi acquisitor
A set of python scripts that work with a tachometer and ADXL343 accelerometer to publish vibration data to the MQTT broker

Required environment variables (in a .env file):
MQTT_URL - mqtt broker url
MQTT_PORT - mqtt broker port
MQTT_USER - mqtt broker user
MQTT_PASSWORD - mqtt broker password
SENSOR_SPI_BUS - Raspberry Pi SPI bus to which ADXL343 is connected
SENSOR_SPI_CE_PIN - Raspberry Pi pin to which ADXL343 CS pin is connected
SENSOR_INT_GPIO - Raspberry Pi pin to which ADXL343 INT1 pin is connected
TACHO_GPIO - Raspberry Pi pin to which tachometer output is connected