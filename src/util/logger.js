/**
 * Imports
 */
const {createLogger, transports, format} = require('winston');

/**
 * Logger setup
 * 
 * Logs a timestamp, logger level, and a specified message. Logs to an error log
 * if an error is reached, a general log file, and the console
 */ 
const logger = createLogger ( {
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf( ({timestamp, level, message}) => {
            return `${timestamp}, [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: 'app.log'})
    ]

});

module.exports = logger;