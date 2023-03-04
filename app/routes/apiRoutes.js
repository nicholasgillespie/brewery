/* IMPORT MODULE //////////////////// */
import express from 'express';

/* IMPORT CONTROLLER //////////////////// */
import cw from '../utils/ctrlWrap.js';
import authController from '../controllers/authController.js';

/* CREATE ROUTER //////////////////// */
const createRouter = (controller, roles, idParam = 'slug') => {
  const router = express.Router();

  /* ROUTES //////////////////// */
  router
    .route('/')
    .get(cw(controller.getAll))
    .post(cw(authController.protect), cw(authController.restrictTo(...roles)), cw(controller.createOne));

  router
    .route(`/:${idParam}`)
    .get(cw(controller.getOne))
    .patch(cw(authController.protect), cw(authController.restrictTo(...roles)), cw(controller.updateOne))
    .delete(cw(authController.protect), cw(authController.restrictTo(...roles)), cw(controller.deleteOne));

  return router;
};

/* EXPORT //////////////////// */
export default createRouter;
