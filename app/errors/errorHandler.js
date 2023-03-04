/* IMPORT DIFFERENT ERROR RESPONSES //////////////////// */
import sendErrorDev from './sendErrorDev.js';
import sendErrorProd from './sendErrorProd.js';
import ErrorProdFxs from './sendErrorProdFxs.js';

/* EXPORT //////////////////// */
export default (err, req, res, next) => {
  // copy error object to new object to prevent mutation of original object (err)
  // set status code to error.statusCode if it exists, otherwise set to 500
  // set status to error.status if it exists, otherwise set to 'error'
  let error = Object.assign(Object.create(err), { ...err });
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';
  // SEPERATION BETWEEN ENVIRONMENTS
  // DEVELOPMENT
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  // PRODUCTION
  } else if (process.env.NODE_ENV === 'production') {
    if (error.code === 11000 && error.keyValue.name) error = ErrorProdFxs.handleDuplicateBeerNameDB(error);
    if (error.code === 11000 && error.keyValue.email) error = ErrorProdFxs.handleDuplicateEmailDB(error);
    // happens when JWT is invalid or expired
    if (error.name === 'JsonWebTokenError') error = ErrorProdFxs.handleJWTError();
    if (error.name === 'TokenExpiredError') error = ErrorProdFxs.handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
