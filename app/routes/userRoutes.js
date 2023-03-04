/* IMPORT MODULE //////////////////// */
import express from 'express';

/* IMPORT CONTROLLER //////////////////// */
import cw from '../utils/ctrlWrap.js';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';

/* ROUTER //////////////////// */
const router = express.Router();

/* ROUTES //////////////////// */
// PUBLIC
router.post('/signup', cw(authController.signup));
router.post('/login', cw(authController.login));
router.get('/logout', cw(authController.logout));
router.post('/forgot-password', cw(authController.forgotPassword));
router.patch('/reset-password/:token', cw(authController.resetPassword));

// PROTECTED
router.use(authController.protect);
// User routes
router.get('/account', cw(userController.getAccount));
router.patch('/update-account', cw(userController.updateAccount));
router.patch('/update-password', cw(authController.updatePassword));
router.delete('/delete-account', cw(userController.falseAccount));

// RESTRICTED TO ADMIN
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(cw(userController.getAll));

router
  .route('/:email')
  .get(cw(userController.getOne))
  .delete(cw(userController.deleteOne));

/* EXPORT //////////////////// */
export default router;
