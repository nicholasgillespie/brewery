/* IMPORT MODEL & SCHEMA //////////////////// */
import model from '../models/modelFactory.js';
import schema from '../schemas/userSchema.js';
/* IMPORT ERROR HANDLER //////////////////// */
import AppError from '../errors/appError.js';

/* EXPORT //////////////////// */
export default {
  async getAll(req, res, next) {
    // prepare query & options
    const filter = { active: { $ne: false } };
    const project = { password: 0, active: 0 };
    const sort = {};
    const limit = {};

    // assemble query filter & options & execute
    const query = model.find('users', filter, { project, sort, limit });
    const result = await query;

    // return response
    res.status(200).json({
      status: 'success',
      results: result.length,
      data: { result },
    });
  },

  async getOne(req, res, next) {
    // prepare query & options
    const filter = { email: req.params.email };
    const project = { password: 0, active: 0 };

    // assemble query filter & options & execute
    const query = model.findOne('users', filter, { project });
    const result = await query;

    // treat result
    if (!result) return next(new AppError('No user found with that ID.', 400));

    // return response
    res.status(200).json({
      status: 'success',
      data: { result },
    });
  },

  async getAccount(req, res, next) {
    // prepare query & options
    const filter = { _id: req.user._id };
    const project = { password: 0, active: 0 };

    // assemble query filter & options & execute
    const query = model.findOne('users', filter, { project });
    const result = await query;

    // treat result
    if (!result) return next(new AppError('No user found with that ID.', 400));

    // return response
    res.status(200).json({
      status: 'success',
      data: { result },
    });
  },

  async updateAccount(req, res, next) {
    // Check if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('This route is not for password updates. Please use /update-password.', 400));
    }

    // Validate required fields in request body & prepare document
    const filter = { _id: req.user._id };
    const update = await schema.update(req.body);
    const projection = { firstname: 1, surname: 1, email: 1 };

    // prepare query & execute
    const query = model.updateOne('users', filter, update, projection);
    const result = await query;

    // treat result
    if (!result) return next(new AppError('No user found with that ID.', 400));

    // return response
    return res.status(result.statusCode).json({
      status: result.status,
      message: result.message,
    });
  },

  async falseAccount(req, res, next) {
    // Validate required fields in request body & prepare document
    const filter = { _id: req.user._id };
    const update = { active: false };
    const projection = { firstname: 1, surname: 1, email: 1 };

    // prepare query & execute
    const query = model.updateOne('users', filter, update, projection);
    const result = await query;

    // treat result
    if (!result) return next(new AppError('No user found with that ID.', 400));

    // return response
    return res.status(result.statusCode).json({
      status: result.status,
      message: result.message,
    });
  },

  /* ADMINISTRATOR ACTIONS //////////////////// */
  async deleteOne(req, res, next) {
    // Validate required fields in request body & prepare document
    const filter = { email: req.params.email };
    const update = { active: false };
    const projection = { firstname: 1, surname: 1, email: 1 };

    // prepare query & execute
    const query = model.updateOne('users', filter, update, projection);
    const result = await query;

    // treat result
    if (!result) return next(new AppError('No user found with that ID.', 400));

    // return response
    return res.status(result.statusCode).json({
      status: result.status,
      message: result.message,
    });
  },
};
