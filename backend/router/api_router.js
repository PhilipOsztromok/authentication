import { Router } from "express";
import authController from "../controller/auth.controller.js";
import ratelimit from "../middleware/ratelimit.js";


const router = Router();

router.route('/signup').post(authController.signup,ratelimit);
router.route('/login').post(authController.login,ratelimit);
router.route('/logout').get(authController.logout);
router.route('/forgot_password').post(authController.forgot_password,ratelimit);

export default router;