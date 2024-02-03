import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { morganMiddleware } from './helpers/loggers.vercel';

import router from './router';
import middleware from './middlewares/index';

const app = express();

app.use(cors({
    credentials: true,
}));
app.set('trust proxy', 1);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morganMiddleware);
app.use(middleware.limiter)
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));


const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080/');
});



app.use('/', router());

export {app, server};