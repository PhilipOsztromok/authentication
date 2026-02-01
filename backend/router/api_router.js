import { Router } from "express";
import authController from "../controller/auth.controller.js";
import ratelimit from "../middleware/ratelimit.js";


const router = Router();

router.route('/signup').post(authController.signup, ratelimit);
router.route('/login').post(authController.login, ratelimit);
router.route('/logout').get(authController.logout);
router.route('/forgot_password').post(authController.forgot_password, ratelimit);
router.route('/reset_password/:token').post(authController.reset_password, ratelimit);

export default router;