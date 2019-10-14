const winston = require('winston');
require('winston-daily-rotate-file');

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.align(),
    winston.format.printf(info => {
        const { timestamp, level, message, ...args } = info;

        return `${timestamp} [${level.toUpperCase()}]: ${message}\n${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}\n`;
    })
);

const logFile = new (winston.transports.DailyRotateFile)({
    filename: './logs/logging-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat
});

var logger = winston.createLogger({
    transports: [
        logFile
    ]
});

module.exports = { logger }