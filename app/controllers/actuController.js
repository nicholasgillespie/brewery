/* IMPORT MODEL & SCHEMA //////////////////// */
import model from '../models/modelFactory.js';
import schema from '../schemas/actuSchema.js';
/* IMPORT ERROR HANDLER //////////////////// */
import AppError from '../errors/appError.js';
/* IMPORT IMAGE PROCESSING //////////////////// */
import processFile from '../utils/processFile.js';

/* EXPORT //////////////////// */
export default {
  async getAll(req, res, next) {
    // prepare query & options
    const filter = {};
    const project = {};
    const sort = { date: -1 };
    const limit = {};

    // assemble query filter & options & execute
    const query = model.find('actus', filter, { project, sort, limit });
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
    const filter = { slug: req.params.slug };
    const project = {};

    // assemble query filter & options & execute
    const query = model.findOne('actus', filter, { project });
    const result = await query;

    // treat result
    if (!result) return next(new AppError('No actu found with that ID.', 400));

    // return response
    res.status(200).json({
      status: 'success',
      data: { result },
    });
  },

  async createOne(req, res, next) {   
    // Validate required fields in request body & prepare document
    const document = await schema.create(req.body, req.file);
    
    // prepare query & execute
    const query = model.insertOne('actus', document);
    const result = await query;

    // return response
    return res.status(result.statusCode).json({
      status: result.status,
      message: result.message,
    });
  },

  async updateOne(req, res, next) {
    // Validate required fields in request body & prepare document
    const filter = { slug: req.params.slug };
    const update = await schema.update(req.body, req.file);

    // prepare query & execute
    const query = model.updateOne('actus', filter, update);
    const result = await query;

    // treat result
    if (!result) return next(new AppError('No actu found with that ID.', 400));

    // return response
    return res.status(result.statusCode).json({
      status: result.status,
      message: result.message,
    });
  },

  async deleteOne(req, res, next) {
    // prepare query & execute
    const document = { slug: req.params.slug };
    const query = model.deleteOne('actus', document);
    const result = await query;

    // treat result
    if (!result) return next(new AppError('No actu found with that ID.', 400));

    // return response
    return res.status(result.statusCode).json({
      status: result.status,
      message: result.message,
    });
  },
};
