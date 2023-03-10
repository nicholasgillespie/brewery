/* IMPORT MODULE //////////////////// */
import express from 'express';

/* IMAGE PROCESSING //////////////////// */
import processFile from '../utils/processFile.js';

/* IMPORT CONTROLLER //////////////////// */
import cw from '../utils/ctrlWrap.js';
import actuController from '../controllers/actuController.js';
import authController from '../controllers/authController.js';

/* CREATE ROUTER //////////////////// */
const router = express.Router();

/* ROUTES //////////////////// */
router
  .route('/')
  .get(cw(actuController.getAll))
  .post(
    cw(authController.protect), 
    cw(authController.restrictTo('admin')), 
    cw(processFile.uploadPhoto('image')),
    cw(actuController.createOne));

router
  .route(`/:slug`)
  .get(cw(actuController.getOne))
  .patch(
    cw(authController.protect), 
    cw(authController.restrictTo('admin')), 
    cw(processFile.uploadPhoto('image')),
    cw(actuController.updateOne))
  .delete(cw(authController.protect), cw(authController.restrictTo('admin')), cw(actuController.deleteOne));

/* EXPORT //////////////////// */
export default router;
