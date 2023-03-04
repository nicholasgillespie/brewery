/* IMPORT MODULE //////////////////// */
import express from 'express';

/* IMPORT CONTROLLER //////////////////// */
import cw from '../utils/ctrlWrap.js';
import viewController from '../controllers/viewController.js';
import authController from '../controllers/authController.js';

/* ROUTER //////////////////// */
const router = express.Router();

/* ROUTES //////////////////// */
// PUBLIC
router
.route('/')
.get(authController.isLoggedIn, cw(viewController.getHome))
.post(cw(viewController.postContact));

router.get('/beers', authController.isLoggedIn, cw(viewController.getBeers));
router.get('/beers/:slug', authController.isLoggedIn, cw(viewController.getBeer));
router.get('/find-us', authController.isLoggedIn, cw(viewController.getFindUs));
router.get('/actus-events', authController.isLoggedIn, cw(viewController.getActusEvents));
router.get('/artistes', authController.isLoggedIn, cw(viewController.getArtistes));

// /amazing-drafts-make-impressive-nights
router.get('/signup', authController.isLoggedIn, cw(viewController.getSignup));
router.get('/login', authController.isLoggedIn, cw(viewController.getLogin));
router.get('/forgot-password', authController.isLoggedIn, cw(viewController.getForgotPassword));
router.get('/reset-password/:token', authController.isLoggedIn, cw(viewController.getResetPassword));
router.get('/logout', authController.isLoggedIn, cw(authController.logout));


// PROTECTED
router.get('/account', cw(authController.protect), cw(viewController.getAccount));

/* EXPORT //////////////////// */
export default router;
