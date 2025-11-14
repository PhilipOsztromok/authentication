import { parsePhoneNumber } from libphonenumber-js
import bcrypt from "bcryptjs";

export default {
    parseTelNo: (phoneNumber)  => {
        try {
            const parsedNumber = parsePhoneNumber(phoneNumber);
            if (parsedNumber) {
                return {
                    countryCode: parsedNumber.countryCallingCode,
                    isoCode: parsedNumber.country,
                    internationalNumber: parsedNumber.formatInternational()
                }
            } else {
                return {
                    countryCode: null,
                    isoCode: null,
                    internationalNumber: null
                }
            }
        } catch (error) {
            return http_errors(next,new Error(error_messages.AUTH.UNAUTHORIZED,request,401));
        }
    },

    hash_password: (password) => {
        return bcrypt.hash(password,10);
    },

    comparePasswords: (password, repeatedPassword) => {
        bcrypt.compare(password, repeatedPassword, function(err,result) {
            if (password != repeatedPassword) {
                // send JWT
            } else {
                return response.json({success: false, message: 'passwords do not match'});
            }
        }
    )},

    generateOTP: (otp_length) => {
        const minimum = Math.pow(10,otp_length-1);
        const maximum = Math.pow(10,otp_length)-1;

        return randomInt(minimum,maximum).toString();
    },

    generateID: () => v4(),

    generateToken: (payload,secret,expiry) => {
        return jwt.sign(payload,secret,{expiresIn: expiry});
    },

    verifyToken: (token, secret) => {
        return jwt.verify(token,secret);
    },

    passwordPolicy: (password) => {
        const password_errors = [];
        const min_length = 8;
        const max_length = 16;
        if (password.length < min_length  || password.length > max_length ) 
            password_errors.push("Password must be between 8 and 16 characters in length.");
        if (!/[a-z]/.test(password))
            password_errors.push("Password must include at least 1 lower case letter!");
        if (!/[A-Z]/.test(password))
            password_errors.push("Password must include at least 1 upper case letter!");
        if (!/[0-9]/.test(password))
            password_errors.push("Password must include at least 1 numeric digit!");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
            password_errors.push("Password must include at least 1 special character!");
        return errors;
    },

    getDomainFromURL: (URL) => {
        try {
            const parsedURL = new URL(URL);
            return parsedURL.hostname;
        } catch (error) {
            throw error
        }
    },
}