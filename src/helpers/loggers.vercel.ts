// Elimination du transport DailyRotateFile et File
import winston from "winston";
import morgan, {StreamOptions} from "morgan";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Ici, on conserve uniquement le transport Console
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

// Stream pour Morgan utilisant le logger modifié
const stream: StreamOptions = {
    write: (message) => logger.info(message.trim()),
};

// Middleware Morgan inchangé
const morganMiddleware = morgan(
    ':remote-addr - :method :url :status :res[content-length] - :response-time ms',
    { stream }
);

export { logger, morganMiddleware };
