// logger config for separate modules
const winston = require("winston");
const path = require("path");

class Logging {
  constructor() {
    const TZ = process.env.TZ;
    this.timezoned = () => {
      return new Date().toLocaleString("en-US", {
        timeZone: TZ,
      });
    };
  }

  createLogger(filename) {
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
        winston.format.timestamp({ format: this.timezoned }),
        winston.format.printf((info) => {
          return `${info.timestamp} - [${info.level}]:${info.label}: ${info.message}`;
        })
      ),
    };

    return winston.createLogger(loggerConfig);
  }
}

module.exports = Logging;
