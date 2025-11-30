import { Router } from "express";
import authController from "../controller/auth.controller.js";
import rate_limiter from "../config/rate_limiter.js";


const router = Router();

router.route('/signup').post(authController.signup,rate_limiter);
router.route('/login').post(authController.login,rate_limiter);
router.route('/logout').get(authController.logout);
router.route('/forgot_password').post(authController.forgot_password,rate_limiter);

export default router;