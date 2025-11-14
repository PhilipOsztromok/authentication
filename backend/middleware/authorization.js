import { EUserRole } from "../constants/application";
import userModel from "../models/user.model";

export default (roles) => {
    return (req,_res,next) => {
        try {
            const newUser = req.authenticatedUser;
            if (!newUser) {
                return new Error();
            }
            if (!roles.includes(newUser.roles)) {
                return new Error();
            } else {
                next();
            }
        } catch (error) {
            return error;
        }
    }
}