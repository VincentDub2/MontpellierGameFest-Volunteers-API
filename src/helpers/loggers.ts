// helpers/logger.ts
import winston from 'winston';
import morgan from 'morgan';
import { StreamOptions } from 'morgan';
import 'winston-daily-rotate-file';

// Configuration de Winston
/*
    * Créer un transport journalier
    * Chaque jour, un nouveau fichier sera créé
    * avec le nom suivant: application-2019-01-01.log
    * Le fichier sera stocké dans le dossier logs
    * Le fichier ne dépassera pas 20Mo
    * Seuls les 14 derniers fichiers seront conservés
 */
const fileTransport = new winston.transports.DailyRotateFile({
    filename: 'tmp' +
        'tmp/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
});

/*
    * Créer un logger avec les paramètres suivants:
    * - Niveau d'information
    * - Formatage des logs en JSON
    * - Ajout du transport journalier
    * - Ajout du transport pour les erreurs
    * - Ajout du transport pour tous les logs
 */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        fileTransport,
        new winston.transports.File({ filename: 'tmp/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'tmp/combined.log' }),
    ],
});


/*
    * Si on est en mode développement, on ajoute un transport console
 */
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}


// Stream pour Morgan utiliser Winston
const stream: StreamOptions = {
    write: (message) => logger.info(message.trim()),
};


/*
    * Créer un middleware Morgan qui utilise le stream précédent
    * et qui affiche les logs suivants:
    * IP - Method URL Status ResponseTime ms
 */
const morganMiddleware = morgan(
    ':remote-addr - :method :url :status :res[content-length] - :response-time ms',
    { stream }
);

export { logger, morganMiddleware };
