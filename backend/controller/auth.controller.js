import error_messages from "../constants/error_messages";
import { signup_body, login_body, validateJoiSchema } from "../services/validation_services";
import helper from "../utils/helper.js";
import errorObject from "../utils/errorObject.js";
import http_errors from "../utils/http_errors";
import http_responses from "../utils/http_responses.js";
import userModel from "../models/user.model.js";
import { EUserRole } from "../constants/application.js";
import { EApplicationEnvironment } from "../constants/application.js";
import config from "../config/config.js";

export default {
    signup: async(req,res,next) => {
        try {
            const { body } = req;
            const { error, value } = validateJoiSchema(signup_body, body);

            if (error) return http_errors(next,error,req,422);
            const { name, emailAddress, password, phoneNumber, consent, role } = value;

            const existingUser = await userModel.findOne( { emailAddress }).select("");
            if (existingUser) return http_errors(next, new Error(error_messages.AUTH.ALREADY_EXIST("User", emailAddress)));

            const {countryCode, isoCode, internationalNumber} = helper.parseTelNo(phoneNumber);
            if (!countryCode || isoCode || internationalNumber) return http_errors(next, new Error(error_messages.AUTH.INVALID_PHONE_NUMBER), req, 422);

            const hashedPassword = helper.hash_password(password);

            const code = helper.generateOTP(6);

            const token = helper.generateID();

            const newUser = { 
                name, 
                emailAddress, 
                password:hashedPassword, 
                phoneNumber: 
                    {   countryCode, 
                        isoCode, 
                        internationalNumber 
                    },
                accountConfirmation: {
                    status: false,
                    token,
                    code
                },
                passwordReset: {
                    token: null,
                    expiry: null,
                    lastResetAt: null
                },
                consent,
                role: EUserRole.USER,
                isActive: null,
                userLocation: {
                    lat: null,
                    long: null
                }

            }

            const savedUser = await userModel.create(newUser)

            if (!savedUser)  return http_errors(next, new Error(error_messages.COMMON.FAILED_TO_SAVE("user")), req, 500);
            
        } catch (error) {
            http_errors(next,error,req,500);
        }
    },

    login: async(req,res,next) => {
        try {
            const { body } = req;
            const { error, value } = validateJoiSchema(login_body, body);

            if (error) return http_errors(next,error,req,422);
            const { emailAddress, password } = value;

            const User = await userModel.findOne( { emailAddress }).select("+password");
            if (!User) return http_errors(next, new Error(error_messages.ERROR.NOT_FOUND("User")),req,404);

            const isMatch = helper.comparePasswords(password,User.password);

            if (!isMatch) return http_errors(next, new Error(error_messages.AUTH.LOGIN_FAILED()),req,401);

            const access_token = helper.generateToken(
                { userID:User.id }, 
                config.auth.jwtSecret,
                config.auth.jwtExpiresIn    
            )

            const DOMAIN = helper.getDomainFromURL(config.server.url);

            res.cookies("access_token", access_token, {
                path: EApplicationEnvironment.DEVELOPMENT ? "v1" : "api/v1",
                domain: DOMAIN,
                sameSite: "strict",
                maxAge: config.auth.jwtExpiresIn * 1000,
                httpOnly: true,
            })

        http_responses(req,res,status_code=200,error_messages.SUCCESS,{
            access_token
        })
            
        } catch (error) {
            http_errors(next,error,req,500);
        }

    },

        logout: async(req,res,next) => {
            try {
                const { cookies } = req;
                let access_token;
                if ( cookies ?.accessToken ) {
                    access_token = cookies.accessToken;
                }
                const auth_header = req.headers.authorization;
                if ( !access_token && auth_header ?. startsWith( "Bearer " )) {
                    access_token = auth_header.subString(7);
                }

                const { userID } = helper.verifyToken(access_token, config.auth.jwtSecret);

                const user = userModel.findById(userID);

                if (!user) {
                    return http_errors(next,new Error(error_messages.ERROR.NOT_FOUND("user")),req,404);
                }

                user.isActive = false;

                await user.save();

                const DOMAIN = helper.getDomainFromURL(config.server.url);

                res.cookies("access_token", access_token, {
                    path: EApplicationEnvironment.DEVELOPMENT ? "v1" : "api/v1",
                    domain: DOMAIN,
                    sameSite: "strict",
                    httpOnly: true,
            }),

            http_responses(req,res,status_code=200,error_messages.SUCCESS);

            } catch (error) {
                http_errors(next,error,req,500);
            }
        },

        forgot_password: async (req,res,next) => {
            try {
                const email_address = req.body.emailAddress;

                if (!email_address) {
                    return http_errors(next,new Error(error_messages.COMMON.INVALID_PARAMETERS("Email address ")),req,400);
                }

                const user = userModel.findOne({emailAddress:email_address});
                
                if (!user) {
                    return http_errors(next,new Error(error_messages.ERROR.NOT_FOUND("user")),req,404);
                }
                    
                }

            } catch (error) {
                
            }
        }
}