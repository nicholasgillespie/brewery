/* IMPORT MODEL //////////////////// */
import model from '../models/modelFactory.js';
import schema from '../schemas/formSchema.js';
/* IMPORT ERROR HANDLER //////////////////// */
import AppError from '../errors/appError.js';
/* IMPORT EMAIL FUNCTION //////////////////// */
import Email from '../utils/email.js';

/* EXPORT //////////////////// */
export default {
  // PUBLIC
  async getHome(req, res, next) {
    // prepare document & options
    const filter = { active: { $ne: false } };
    const project = {
      _id: 0, name: 1, slug: 1, style: 1, abv: 1, ibu: 1, ebv: 1,
    };
    const sort = {};
    const limit = 5;

    // assemble query filter & options & execute
    const query = model.find('beers', filter, { project, sort, limit });
    const result = await query;

    // return response
    res.status(200).render('template', {
      page: 'home',
      results: result.length,
      data: result,
    });
  },

  async postContact(req, res, next) {
    try {
      // Validate input data
      const document = await schema.contactForm(req.body);
      const { firstname, surname, email, message } = document;
      
      // Create user object with email property
      const user = { email };
  
      // Send email
      const emailInstance = new Email(user);
      await emailInstance.sendContactForm({ firstname, surname, email, message });
  
      return res.status(200).json({
        status: 'success',
        message: 'Email sent successfully',
      });
    } catch (err) {
      // If the error is an instance of AppError, meaning it's a validation error
      if (err instanceof AppError) {
        return res.status(400).json({ status: 'error', message: err.message });
      };
      
      // Otherwise, log the error to the console & return generic error message
      console.error('Error sending email:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'There was an error sending the email. Try again later.' 
      });
    }
  },
  
  async getBeers(req, res, next) {
    // prepare document & options
    const filter = { active: { $ne: false } };
    const project = {
      _id: 0, name: 1, slug: 1, style: 1,
    };
    const sort = {};
    const limit = {};

    // assemble query filter & options & execute
    const query = model.find('beers', filter, { project, sort, limit });
    const result = await query;

    // return response
    res.status(200).render('template', {
      page: 'beers',
      results: result.length,
      data: result,
    });
  },

  async getBeer(req, res, next) {
    // prepare document & options
    const filter = { slug: req.params.slug, active: { $ne: false } };
    const project = { _id: 0 };

    // assemble query filter & options & execute
    const query = model.findOne('beers', filter, { project });
    const result = await query;

    // treat result
    if (!result) return next(new AppError('No beer found with that ID.', 404));

    // return response
    res.status(200).render('template', {
      page: 'beer',
      data: result,
    });
  },

  async getFindUs(req, res, next) {
    // prepare document & options
    const filter = { active: { $ne: false } };
    const project = { _id: 0 };
    const sort = {};
    const limit = {};

    // assemble query filter & options & execute
    const query = model.find('locations', filter, { project, sort, limit });
    const result = await query;

    // return response
    res.status(200).render('template', {
      page: 'find-us',
      results: result.length,
      data: result,
    });
  },

  async getActusEvents(req, res, next) {
    // prepare document & options
    const filter = { active: { $ne: false } };
    const project = { _id: 0 };
    const sort = { date: -1 };
    const limit = {};

    // assemble query filter & options & execute
    const query = model.find('actus', filter, { project, sort, limit });
    const result = await query;

    // return response
    res.status(200).render('template', {
      page: 'actus-events',
      results: result.length,
      data: result,
    });
  },

  async getArtistes(req, res, next) {
    // prepare document & options
    const filter = { active: { $ne: false } };
    const project = { _id: 0 };
    const sort = {};
    const limit = {};

    // assemble query filter & options & execute
    const query = model.find('artistes', filter, { project, sort, limit });
    const result = await query;

    // return response
    res.status(200).render('template', {
      page: 'artistes',
      results: result.length,
      data: result,
    });
  },

  getSignup(req, res, next) {
    res.status(200).render('template', { page: 'signup' });
  },

  getLogin(req, res, next) {
    res.status(200).render('template', { page: 'login' });
  },

  getForgotPassword(req, res, next) {
    res.status(200).render('template', { page: 'forgot-password' });
  },

  getResetPassword(req, res, next) {
    res.status(200).render('template', { page: 'reset-password' });
  },



  // PROTECTED
  getAccount(req, res, next) {
    res.status(200).render('template', { page: 'account' });
  },
};
