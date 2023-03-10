/* IMPORT MODULE //////////////////// */
import express from 'express';
// import multer from 'multer';
// import processFile from '../utils/processFile.js';

/* IMPORT CONTROLLER //////////////////// */
import cw from '../utils/ctrlWrap.js';
import authController from '../controllers/authController.js';
import beerController from '../controllers/beerController.js';
import locationController from '../controllers/locationController.js';
import actuController from '../controllers/actuController.js';
import artisteController from '../controllers/artisteController.js';

/* CREATE ROUTER //////////////////// */
const createRouter = (word, roles, fieldName) => {
  const controllerMap = {
    beer: beerController,
    location: locationController,
    actu: actuController,
    artiste: artisteController
  };
  const controller = controllerMap[word];
  const router = express.Router();
  // const upload = multer({ storage: multer.memoryStorage() });

  /* ROUTES //////////////////// */
  router
    .route('/')
    .get(cw(controller.getAll))
    .post(cw(authController.protect), 
          cw(authController.restrictTo(...roles)),
          cw(processFile.storeFile(word, ...fieldName)),
          // cw(processFile(word, ...fieldName)),
          // processFile(word, ...fieldName),
          cw(controller.createOne));

  router
    .route(`/:slug`)
    .get(cw(controller.getOne))
    .patch(cw(authController.protect), cw(authController.restrictTo(...roles)), cw(controller.updateOne))
    .delete(cw(authController.protect), cw(authController.restrictTo(...roles)), cw(controller.deleteOne));

  return router;
};

/* EXPORT //////////////////// */
export default createRouter;
