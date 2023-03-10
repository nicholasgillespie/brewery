/* IMPORT MODULE //////////////////// */
import express from 'express';

/* IMAGE PROCESSING //////////////////// */
import processFile from '../utils/processFile.js';

/* IMPORT CONTROLLER //////////////////// */
import cw from '../utils/ctrlWrap.js';
import artisteController from '../controllers/artisteController.js';
import authController from '../controllers/authController.js';

/* CREATE ROUTER //////////////////// */
const router = express.Router();

/* ROUTES //////////////////// */
router
  .route('/')
  .get(cw(artisteController.getAll))
  .post(
    cw(authController.protect), 
    cw(authController.restrictTo('admin')), 
    cw(processFile.uploadPhoto('image')),
    cw(artisteController.createOne));

router
  .route(`/:slug`)
  .get(cw(artisteController.getOne))
  .patch(
    cw(authController.protect), 
    cw(authController.restrictTo('admin')), 
    cw(processFile.uploadPhoto('image')),
    cw(artisteController.updateOne))
  .delete(cw(authController.protect), cw(authController.restrictTo('admin')), cw(artisteController.deleteOne));

/* EXPORT //////////////////// */
export default router;
