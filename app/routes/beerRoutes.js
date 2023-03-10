/* IMPORT MODULE //////////////////// */
import express from 'express';

/* IMAGE PROCESSING //////////////////// */
import processFile from '../utils/processFile.js';

/* IMPORT CONTROLLER //////////////////// */
import cw from '../utils/ctrlWrap.js';
import beerController from '../controllers/beerController.js';
import authController from '../controllers/authController.js';

/* CREATE ROUTER //////////////////// */
const router = express.Router();

  /* ROUTES //////////////////// */
  router
    .route('/')
    .get(cw(beerController.getAll))
    .post(
      cw(authController.protect),  
      cw(authController.restrictTo('admin')), 
      cw(processFile.uploadPhoto('image', 'cover', 'aroma-web')),
      cw(beerController.createOne));

  router
    .route(`/:slug`)
    .get(cw(beerController.getOne))
    .patch(
      cw(authController.protect), 
      cw(authController.restrictTo('admin')), 
      cw(processFile.uploadPhoto('image', 'cover', 'aroma-web')),
      cw(beerController.updateOne))
    .delete(cw(authController.protect), cw(authController.restrictTo('admin')), cw(beerController.deleteOne));

/* EXPORT //////////////////// */
export default router;
