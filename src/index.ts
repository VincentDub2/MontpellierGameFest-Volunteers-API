import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { morganMiddleware } from './helpers/loggers.vercel';

import router from './router';
import middleware from './middlewares/index';

// Load environment variables from .env file
import dotenv from 'dotenv';
import path from 'path';

const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (result.error) {
  console.error('Error loading .env file:', result.error);
}

console.log("test");

// Check that all required environment variables are set
const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI)

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

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080/');
});



app.use('/', router());



export default app;