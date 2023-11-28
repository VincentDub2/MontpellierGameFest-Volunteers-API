// helpers/logger.ts
import winston from 'winston';
import morgan from 'morgan';
import { StreamOptions } from 'morgan';

// Configuration de Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// Stream pour Morgan utiliser Winston
const stream: StreamOptions = {
    write: (message) => logger.info(message.trim()),
};

// Configuration de Morgan
const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream }
);

export { logger, morganMiddleware };
