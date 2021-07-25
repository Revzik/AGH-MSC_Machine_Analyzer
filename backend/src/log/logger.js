// logger config for separate modules
const winston = require("winston");
const path = require("path");
//const fileLoggerConfig = require(__dirname + '/config/log/winston.json');

const TZ = process.env.TZ;
const timezoned = () => {
  return new Date().toLocaleString("en-US", {
    timeZone: TZ,
  });
};

function createLogger(filename) {
  const loggerConfig = {
    transports: [
      new winston.transports.Console({
        level: "debug",
      }),
    ],
    format: winston.format.combine(
      winston.format.label({
        label: path.basename(filename),
      }),
      winston.format.timestamp({ format: timezoned }),
      winston.format.printf((info) => {
        return `${info.timestamp} - [${info.level}]:${info.label}: ${info.message}`;
      })
    ),
  };

  return winston.createLogger(loggerConfig);
}

module.exports = { createLogger };
