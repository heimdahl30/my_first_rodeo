import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import unknownEndpoint from './middleware/unknownEndpoint.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET as string));

app.use('/api/v1', appRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
