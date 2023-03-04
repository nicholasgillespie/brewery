/* IMPORT MODULES ////////////////////////// */
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
/* IMPORT INPUT VALIDATORS //////////////////// */
import validator from '../validators/validator.js';

export default {
  async sendToken(userId, statusCode, status, message, res) {
    // Create token
    const token = await this.createToken(userId);

    // Create cookie optionsS
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000),
      httpOnly: true,
    };

    // If the environment is production, set secure to true
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    // Create cookie, send token in cookie and send response
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
      status,
      token,
      message,
    });
  },

  async createToken(id) {
    const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
    // Create token
    const token = await jwt.sign({ id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Return token
    return token;
  },

  async verifyToken(token) {
    const { JWT_SECRET } = process.env;
    // Verify token
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    // Return decoded token
    return decoded;
  },

  async verifyPassword(reqBodyPassword, userPassword) {
    // Compare passwords
    const isMatch = await bcrypt.compare(reqBodyPassword, userPassword);

    // If passwords do not match, return false
    if (!isMatch) return false;

    // If passwords match, return true
    return true;
  },

  async updatePassword(reqBody) {
    // 1. Normalize data
    // 2. Select allowed fields
    let { password, passwordConfirm } = {
      password: reqBody.password.trim(),
      passwordConfirm: reqBody.passwordConfirm.trim(),
    };

    // 3. Validate input and return errors if any
    validator.validatePassword(password);
    validator.validatePasswordConfirm(password, passwordConfirm);

    // Hash password
    password = await bcrypt.hash(password, 12);
    // Delete passwordConfirm from reqBody
    passwordConfirm = undefined;

    // 4. Create document object
    const document = {
      password,
    };

    // 5. Add additional fields
    document.passwordChangedAt = new Date();

    // 6. Return document
    return document;
  },

  createPasswordResetToken() {
    // Create password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Return password reset token
    return resetToken;
  },

  hashPassworResetToken(resetToken) {
    // Hash password reset token
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Return hashed password reset token
    return hashedResetToken;
  },
};
