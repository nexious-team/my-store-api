const winston = require('winston');
require('winston-daily-rotate-file');

const logFormatFile = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.align(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    return `${timestamp} [${level.toUpperCase()}]: ${message}\n${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}\n`;
  }),
);

const logFormatConsole = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH' }),
  winston.format.align(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    return winston.format.colorize().colorize(level, `${timestamp} [${level.toUpperCase()}]: ${message}\n${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`);
  }),
);

const logFile = new (winston.transports.DailyRotateFile)({
  filename: './logs/logging-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormatFile,
});

const logger = winston.createLogger({
  transports: [
    logFile,
  ],
});

//
// If we're not in production then log to the `console`
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: logFormatConsole,
  }));
}

module.exports = { logger };
