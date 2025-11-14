import config from "../config/config.js";
import userModel from "../models/user.model.js";
import http_errors from "../utils/http_errors.js";

export default async (req,resp,next) => {
    try {
        const request = req;
        const cookies = request.cookies;
        let accessToken;
        if (cookies?.accessToken) {
            accessToken = cookies.accessToken;
            console.log("Access token found in cookies!");
        }
        if (!accessToken) {
            const authHeader = request.headers.authorization;
            if (authHeader?.startsWith("Bearer")) {
            accessToken = authHeader.substring(7);
            console.log("Access token found in authHeader!");
        }

        if (!accessToken) {
            return http_errors(next,new Error(error_messages.AUTH.UNAUTHORIZED,request,401));
        }

        }
        
        try {
            const { userId } = verifyToken();
            const user = userModel.findOne({ id:userId });
            if (! user) {
                return http_errors(next,new Error(error_messages.AUTH.UNAUTHORIZED,request,401));
            }
            req.authenticatedUser = user;
            return next();
        } catch (error) {
            return http_errors(next,new Error(error_messages.AUTH.UNAUTHORIZED,request,401));
        }

    } catch (error) {
        return http_errors(next,new Error(error_messages.AUTH.INTERNAL_SERVER_ERROR,request,500));
    }

}