/* IMPORT MODULE //////////////////// */
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSantize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';

/* IMPORT ERROR HANDLER //////////////////// */
import AppError from './errors/appError.js';
import globalErrorHandler from './errors/errorHandler.js';

/* IMPORT ROUTERS & CONTROLLERS //////////////////// */
import viewRouter from './routes/viewRoutes.js';
import beerRouter from './routes/beerRoutes.js';
import locationRouter from './routes/locationRoutes.js';
import actuRouter from './routes/actuRoutes.js';
import artisteRouter from './routes/artisteRoutes.js';

import apiRouter from './routes/apiRoutes.js';
import userRouter from './routes/userRoutes.js';

/* CURRENT DIRECTORY */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* DESTRUCTURE ENV VARIABLES //////////////////// */
const { NODE_ENV, API_PATH } = process.env;

/* START REQ/RES CYCLE //////////////////// */
const app = express(); /* creates express app */

/* SET VIEW ENGINE & VIEWS LOCATION //////////////////// */
app.set('view engine', 'ejs'); /* sets view engine to ejs */
app.set('views', path.join(__dirname, 'views')); /* sets views directory */
app.use(express.static(path.join(__dirname, 'public'))); /* sets static assets directory */

/* GLOBAL MIDDLEWARE ////////////////////////////// */
app.use(helmet()); /* set security HTTP headers */
if (NODE_ENV === 'development') app.use(morgan('dev')); /* development logging */
app.use(express.json({ limit: '10kb' })); /* parses json data from body to req.body */
app.use(express.urlencoded({ extended: true, limit: '10kb' })); /* parses urlencoded data from body to req.body */
app.use(cookieParser()); /* parses cookies from header to req.cookies */
app.use(mongoSantize()); /* data sanitization against NoSQL query injection */
app.use(xss()); /* data sanitization against XSS */
app.use(hpp({ whitelist: ['style', 'abv', 'ibu'] })); /* prevent parameter pollution */
app.use('/api', rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})); /* rate limit requests from same API */

/* LOCAL MIDDLEWARE ////////////////////////////// */
app.use((req, res, next) => {
  // console.log('Hello from the middleware');
  next();
});

/* MOUNT ROUTE //////////////////// */
app.use('/', viewRouter);
app.use(`${API_PATH}/beers`, beerRouter);
app.use(`${API_PATH}/locations`, locationRouter);
app.use(`${API_PATH}/actus`, actuRouter);
app.use(`${API_PATH}/artistes`, artisteRouter);
app.use(`${API_PATH}/users`, userRouter);
// app.use(`${API_PATH}/beers`, apiRouter('beer', ['admin'], ['image', 'cover', 'aroma-web']));
// app.use(`${API_PATH}/beers`, apiRouter('beer', ['admin'], ['image']));
// app.use(`${API_PATH}/locations`, apiRouter('location', ['admin'], ['image']));
// app.use(`${API_PATH}/actus`, apiRouter('actu', ['admin'], ['image']));
// app.use(`${API_PATH}/artistes`, apiRouter('artiste', ['admin'], ['image']));

/* UNHANDLED ROUTE //////////////////// */
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

/* ERROR HANDLING //////////////////// */
app.use(globalErrorHandler);

/* EXPORT //////////////////// */
export default app;
