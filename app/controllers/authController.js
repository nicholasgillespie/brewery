/* IMPORT MONGODB FUNCTION //////////////////// */
import { ObjectId } from 'mongodb';
/* IMPORT MODEL & SCHEMA & COMPONENT //////////////////// */
import model from '../models/modelFactory.js';
import schema from '../schemas/userSchema.js';
import authComponent from '../components/authComponent.js';
/* IMPORT ERROR HANDLER //////////////////// */
import AppError from '../errors/appError.js';
/* IMPORT EMAIL FUNCTION //////////////////// */
import Email from '../utils/email.js';

const {
  SITE_PROTO, SITE_HOST, SITE_PORT,
} = process.env;

/* EXPORT //////////////////// */
export default {
  async signup(req, res, next) {
    // Validate required fields in request body & prepare document
    const document = await schema.create(req.body);

    // prepare query & execute
    const query = model.insertOne('users', document);
    const result = await query;

    // Send welcome email
    const url = `${req.protocol}://${req.get('host')}/account`;
    const user = { firstname: document.firstname, email: document.email };
    await new Email(user, url).sendWelcome();

    // Create token & return response
    return authComponent.sendToken(
      result.insertedId.toString(),
      result.statusCode,
      result.status,
      result.message,
      res,
    );
  },

  async login(req, res, next) {
    // Validate required fields in request body
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Please provide email and password.', 400));

    // prepare query & options
    const filter = { email };
    const project = {
      _id: 1, email: 1, password: 1, active: 1,
    };

    // assemble query filter & options & execute
    const query = model.findOne('users', filter, { project });
    const result = await query;

    // Verify password match
    if (!result || !await authComponent.verifyPassword(password, result.password)) {
      return next(new AppError('Incorrect email or password.', 401));
    }
    if (result.active !== true) return next(new AppError('Your account is not active. Please contact an administrator.', 401));

    // Create token & return response
    authComponent.sendToken(
      result._id.toString(),
      200,
      'success',
      `user logged in. ID: ${result._id.toString()}.`,
      res,
    );
  },

  async logout(req, res, next) {
    // Create cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    };

    // If the environment is production, set secure to true
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    // return response
    res.cookie('jwt', 'loggedout', cookieOptions);
    res.status(200).json({ status: 'success' });
  },

  async protect(req, res, next) {
    let token;
    // Get token from request header if it exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      [, token] = req.headers.authorization.split(' ');
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) return next(new AppError('You are not logged in. Please log in to get access.', 401));

    let decoded;
    // Verify token
    try {
      decoded = await authComponent.verifyToken(token);
    } catch (error) {
      return next(error);
    }

    // prepare query & options
    const filter = { _id: new ObjectId(decoded.id) };
    const project = {
      _id: 1, firstname: 1, surname: 1, passwordChangedAt: 1, role: 1, email: 1, active: 1,
    };

    // assemble query filter & options & execute
    const query = model.findOne('users', filter, { project });
    const result = await query;

    // treat result
    if (!result) return next(new AppError('The user belonging to this token does no longer exist.', 401));

    // Check if user is active
    if (result.active !== true) return next(new AppError('Your account is not active. Please contact an administrator.', 401));

    // Check if user changed password after token was issued
    if (result.passwordChangedAt) {
      const changedAt = parseInt(result.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedAt) {
        return next(new AppError('You recently changed password. Please log in again.', 401));
      }
    }

    // Grant access to protected route & pass user to next middleware
    req.user = result;
    res.locals.user = result;

    // instruct the browser not to cache the protected pages
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return next();
  },

  // Only for rendered pages, no errors!
  async isLoggedIn(req, res, next) {
    // Get token from request cookie if it exists
    if (req.cookies.jwt) {
      try {
        // Verify token
        const decoded = await authComponent.verifyToken(req.cookies.jwt);

        // Check if user still exists
        const filter = { _id: new ObjectId(decoded.id) };
        const project = {
          _id: 1, firstname: 1, surname: 1, passwordChangedAt: 1, role: 1, email: 1, active: 1,
        };
        const query = model.findOne('users', filter, { project });
        const user = await query;
        if (!user) return next();

        // Check if user is active
        if (user.active === false) return next();

        // Check if user changed password after token was issued
        if (user.passwordChangedAt) {
          const changedAt = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
          if (decoded.iat < changedAt) {
            return next();
          }
        }

        // There is a logged in user
        res.locals.user = user;

        // instruct the browser not to cache the protected pages
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        return next();
      } catch (error) {
        return next();
      }
    }
    return next();
  },

  restrictTo(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action.', 403));
      }
      return next();
    };
  },

  async updatePassword(req, res, next) {
    // Get user from collection
    const filter = { email: req.user.email };
    const project = { _id: 1, email: 1, password: 1 };
    const user = await model.findOne('users', filter, { project });

    // Check if POSTed current password is correct
    if (!(await authComponent.verifyPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // Validate password, hash it & prepare document
    const update = await authComponent.updatePassword(req.body);

    // Update changedPasswordAt property for the user
    const result = await model.updateOne('users', { _id: user._id }, update);

    // Create token & return response
    return authComponent.sendToken(
      user._id.toString(),
      result.statusCode,
      result.status,
      'password reset successful.',
      res,
    );
  },

  async forgotPassword(req, res, next) {
    // Validate required fields in request body
    const { email } = req.body;
    if (!email) return next(new AppError('Please provide email.', 400));

    // Get user based on POSTed email
    const filter = { email: req.body.email };
    const project = { _id: 1, firstname: 1, email: 1 };
    const user = await model.findOne('users', filter, { project });
    if (!user) return next(new AppError('There is no user with email address.', 404));

    // Generate the random reset token & hashed version
    const resetToken = authComponent.createPasswordResetToken();
    const hashedResetToken = authComponent.hashPassworResetToken(resetToken);

    // Send email to user with token & update user document
    try {
      // Wait for email to be sent or timeout to be reached
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error()), 6000);
      });
      const resetURL = `${SITE_PROTO}://${SITE_HOST}:${SITE_PORT}/reset-password/${resetToken}`;
      const emailUser = { firstname: user.firstname, email: user.email };
      await Promise.race([timeoutPromise, await new Email(emailUser, resetURL).sendPasswordReset()]);

      const update = {
        passwordResetToken: hashedResetToken,
        passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
      };

      // Update user document
      await model.updateOne('users', { _id: user._id }, update);

      // Return response
      res.status(200).json({
        status: 'success',
        message: 'password reset token sent to email.',
      });
    } catch (err) {
      return next(new AppError('There was an error sending the email. Please try again later.', 500));
    }
  },

  async resetPassword(req, res, next) {
    // Get user based on the token
    const hashedToken = authComponent.hashPassworResetToken(req.params.token);
    const filter = {
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    };
    const project = { _id: 1, email: 1 };
    const user = await model.findOne('users', filter, { project });
    if (!user) return next(new AppError('Token is invalid or has expired.', 400));

    // Update changedPasswordAt property for the user
    const document = await authComponent.updatePassword(req.body);
    const update = {
      password: document.password,
      passwordChangedAt: document.passwordChangedAt,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    };
    await model.updateOne('users', { _id: user._id }, update);

    // Create token & return response
    return authComponent.sendToken(
      user._id.toString(),
      200,
      'success',
      'Password reset successful.',
      res,
    );
  },
};
