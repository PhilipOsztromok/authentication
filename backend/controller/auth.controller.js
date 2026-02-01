import error_messages from "../constants/error_messages.js";
import {
  signup_body,
  login_body,
  reset_password_body,
  validateJoiSchema,
} from "../services/validation_services.js";
import helper from "../utils/helper.js";
import errorObject from "../utils/errorObject.js";
import http_errors from "../utils/http_errors.js";
import http_responses from "../utils/http_responses.js";
import userModel from "../models/user.model.js";
import { EUserRole } from "../constants/application.js";
import { EApplicationEnvironment } from "../constants/application.js";
import config from "../config/config.js";
import emailService from "../services/email_services.js";

export default {
  signup: async (req, res, next) => {
    try {
      const { body } = req;
      const { error, value } = validateJoiSchema(signup_body, body);
      console.log("hello signup");
      if (error) return http_errors(next, error, req, 422);
      const { name, emailAddress, password, phoneNumber, consent, role } =
        value;

      const existingUser = await userModel.findOne({ emailAddress }).select("");
      if (existingUser)
        return http_errors(
          next,
          new Error(error_messages.AUTH.ALREADY_EXIST("User", emailAddress)),
          req,
          409,
        );

      const { countryCode, isoCode, internationalNumber } =
        helper.parseTelNo(phoneNumber);
      if (!countryCode || !isoCode || !internationalNumber)
        return http_errors(
          next,
          new Error(error_messages.AUTH.INVALID_PHONE_NUMBER),
          req,
          422,
        );

      const hashedPassword = await helper.hash_password(password);

      const code = helper.generateOTP(6);

      const token = helper.generateID();

      const newUser = {
        name,
        emailAddress,
        password: hashedPassword,
        phoneNumber: { countryCode, isoCode, internationalNumber },
        accountConfirmation: {
          status: false,
          token,
          code,
        },
        passwordReset: {
          token: null,
          expiry: null,
          lastResetAt: null,
        },
        consent,
        role: EUserRole.USER,
        isActive: null,
        userLocation: {
          lat: null,
          long: null,
        },
      };

      const savedUser = await userModel.create(newUser);

      if (!savedUser)
        return http_errors(
          next,
          new Error(error_messages.COMMON.FAILED_TO_SAVE("user")),
          req,
          500,
        );

      http_responses(req, res, 201, error_messages.SUCCESS, {
        message: "Account created successfully",
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.emailAddress
        }
      });
    } catch (error) {
      http_errors(next, error, req, 500);
    }
  },

  login: async (req, res, next) => {
    try {
      const { body } = req;
      const { error, value } = validateJoiSchema(login_body, body);

      if (error) return http_errors(next, error, req, 422);
      const { emailAddress, password } = value;

      const User = await userModel
        .findOne({ emailAddress })
        .select("+password");
      if (!User)
        return http_errors(
          next,
          new Error(error_messages.ERROR.NOT_FOUND("User")),
          req,
          404,
        );

      const isMatch = helper.comparePasswords(password, User.password);

      if (!isMatch)
        return http_errors(
          next,
          new Error(error_messages.AUTH.LOGIN_FAILED()),
          req,
          401,
        );

      const access_token = helper.generateToken(
        { userID: User.id },
        config.auth.jwtSecret,
        config.auth.jwtExpiresIn,
      );

      const DOMAIN = helper.getDomainFromURL(config.server.url);

      res.cookie("access_token", access_token, {
        path: EApplicationEnvironment.DEVELOPMENT ? "v1" : "api/v1",
        domain: DOMAIN,
        sameSite: "strict",
        maxAge: config.auth.jwtExpiresIn * 1000,
        httpOnly: true,
      });

      http_responses(req, res, 201, error_messages.SUCCESS, {
        access_token,
      });
    } catch (error) {
      http_errors(next, error, req, 500);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { cookies } = req;
      let access_token;
      if (cookies?.accessToken) {
        access_token = cookies.accessToken;
      }
      const auth_header = req.headers.authorization;
      if (!access_token && auth_header?.startsWith("Bearer ")) {
        access_token = auth_header.substring(7);
      }

      const { userID } = helper.verifyToken(
        access_token,
        config.auth.jwtSecret,
      );

      const user = await userModel.findById(userID);

      if (!user) {
        return http_errors(
          next,
          new Error(error_messages.ERROR.NOT_FOUND("user")),
          req,
          404,
        );
      }

      user.isActive = false;

      await user.save();

      const DOMAIN = helper.getDomainFromURL(config.server.url);

      (res.clearCookie("access_token", access_token, {
        path: EApplicationEnvironment.DEVELOPMENT ? "v1" : "api/v1",
        domain: DOMAIN,
        sameSite: "strict",
        httpOnly: true,
      }),
        http_responses(req, res, 200, error_messages.SUCCESS));
    } catch (error) {
      http_errors(next, error, req, 500);
    }
  },

  forgot_password: async (req, res, next) => {
    try {
      const email_address = req.body.emailAddress;
      let expiryTime = 15;

      if (!email_address) {
        return http_errors(
          next,
          new Error(error_messages.COMMON.INVALID_PARAMETERS("Email address ")),
          req,
          400,
        );
      }

      const user = await userModel.findOne({ emailAddress: email_address });

      if (!user) {
        return http_errors(
          next,
          new Error(error_messages.ERROR.NOT_FOUND("user")),
          req,
          404,
        );
      }



      const token = helper.generateID();

      const expiry = helper.generateResetPasswordExpiry(expiryTime);

      user.passwordReset.token = token;

      user.passwordReset.expiry = expiry;

      await user.save();

      const resetURL = `${config.client_url}/app/passwordReset/${token}`;

      // LOGGING FOR DEV:
      console.log("---------------------------------------------------");
      console.log("PASSWORD RESET LINK:", resetURL);
      console.log("---------------------------------------------------");

      const to = [email_address];

      const subject = "Password Reset Email";

      const text = `Please reset your password by clicking the link.  This link will expire in ${expiryTime} minutes!\n\nReset Link: ${resetURL}`;

      try {
        await emailService.sendEmail(to, subject, text);
      } catch (err) {
        console.error(`Email service error:`, err);
       
      }

      return http_responses(
        req,
        res,
        200,
        error_messages.SUCCESS,
        {
          message: "If an account with that email exists, a password reset link has been sent."
        }
      );
    } catch (error) {
      return http_errors(
        next,
        new Error(error_messages.ERROR.NOT_FOUND("user")),
        req,
        500,
      );
    }
  },

  reset_password: async (req, res, next) => {
    try {
      const { body } = req;
      const { token } = req.params;

      const { error, value } = validateJoiSchema(reset_password_body, body);
      if (error) return http_errors(next, error, req, 422);

      const { password } = value;

      const user = await userModel.findOne({ "passwordReset.token": token });

      if (!user) {
        return http_errors(
          next,
          new Error(error_messages.ERROR.INVALID_TOKEN),
          req,
          400
        );
      }

      const currentTime = new Date();
      if (user.passwordReset.expiry && currentTime > user.passwordReset.expiry) {
        return http_errors(
          next,
          new Error(error_messages.AUTH.TOKEN_EXPIRED),
          req,
          400
        );
      }

      const hashedPassword = await helper.hash_password(password);

      user.password = hashedPassword;
      user.passwordReset.token = null;
      user.passwordReset.expiry = null;
      user.passwordReset.lastResetAt = currentTime;

      await user.save();

      return http_responses(
        req,
        res,
        200,
        error_messages.SUCCESS,
        {
          message: "Password reset successfully. You can now login with your new password."
        }
      );

    } catch (error) {
      http_errors(next, error, req, 500);
    }
  },
};
