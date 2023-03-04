/* IMPORT ERROR CLASS //////////////////// */
import AppError from './appError.js';

/* EXPORT //////////////////// */
export default {
  // handle duplicate fields in MongoDB - error (11000)
  handleDuplicateBeerNameDB(error) {
    const key = Object.keys(error.keyValue)[0];
    const message = `Duplicate beer name: ${error.keyValue[key]}. Please insert another value.`;
    return new AppError(message, 400);
  },

  // handle duplicate email in MongoDB - error (11000)
  handleDuplicateEmailDB(error) {
    const message = `Duplicate email: ${error.keyValue.email}. Please insert another email.`;
    return new AppError(message, 400);
  },

  // handle invalid JWT - error (JsonWebTokenError)
  handleJWTError() {
    return new AppError('Invalid token. Please log in again.', 401);
  },

  // handle expired JWT - error (TokenExpiredError)
  handleJWTExpiredError() {
    return new AppError('Your token has expired. Please log in again.', 401);
  },
};
