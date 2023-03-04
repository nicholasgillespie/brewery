/* EXPORT //////////////////// */
export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; /* isOperation property added to seperate Operational errors from Programming ones */
    Error.captureStackTrace(this, this.constructor); /* create .stack property on a target object */
  }
}
