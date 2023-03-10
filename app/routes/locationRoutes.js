/* IMPORT MODULE //////////////////// */
import express from 'express';

/* IMAGE PROCESSING //////////////////// */
import processFile from '../utils/processFile.js';

/* IMPORT CONTROLLER //////////////////// */
import cw from '../utils/ctrlWrap.js';
import locationController from '../controllers/locationController.js';
import authController from '../controllers/authController.js';

/* CREATE ROUTER //////////////////// */
const router = express.Router();

/* ROUTES //////////////////// */
router
  .route('/')
  .get(cw(locationController.getAll))
  .post(
    cw(authController.protect), 
    cw(authController.restrictTo('admin')), 
    cw(processFile.uploadPhoto('image')),
    cw(locationController.createOne));

router
  .route(`/:slug`)
  .get(cw(locationController.getOne))
  .patch(
    cw(authController.protect), 
    cw(authController.restrictTo('admin')), 
    cw(processFile.uploadPhoto('image')),
    cw(locationController.updateOne))
  .delete(cw(authController.protect), cw(authController.restrictTo('admin')), cw(locationController.deleteOne));

/* EXPORT //////////////////// */
export default router;
