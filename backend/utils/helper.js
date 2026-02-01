import { parsePhoneNumber } from "libphonenumber-js";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import jwt from "jsonwebtoken"; // Ensure this is installed!
import { v4 as uuidv4 } from 'uuid'; // Ensure this is installed!

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default {
    parseTelNo: (phoneNumber) => {
        try {
            console.log("Parsing Phone:", phoneNumber);
            let input = String(phoneNumber).trim();

            // Fix: If user enters "92311..." (missing +), prepend it.
            if (/^92\d{10}$/.test(input)) {
                input = '+' + input;
            }
            // Fix: If user enters "0311..." (local PK format), convert to +92
            else if (/^03\d{9}$/.test(input)) {
                input = '+92' + input.substring(1);
            }
            // Fix: If just digits and length > 10, try prepending +
            else if (/^\d{11,15}$/.test(input)) {
                input = '+' + input;
            }

            console.log("Normalized Phone Input:", input);
            const parsedNumber = parsePhoneNumber(input);

            if (parsedNumber && parsedNumber.isValid()) {
                return {
                    countryCode: parsedNumber.countryCallingCode,
                    isoCode: parsedNumber.country,
                    internationalNumber: parsedNumber.formatInternational()
                }
            }
            console.warn("Invalid phone number detected by libphonenumber");
            return { countryCode: null, isoCode: null, internationalNumber: null };

        } catch (error) {
            console.error("Error parsing phone number:", error.message);
            return {
                countryCode: null,
                isoCode: null,
                internationalNumber: null
            };
        }
    },

    hash_password: (password) => {
        return bcrypt.hash(password, 10);
    },

    comparePasswords: (password, repeatedPassword) => {
        // This function implementation looked wrong in the original code, 
        // it was comparing plain text and returning a response object?
        // Fixing it to standard bcrypt compare
        return bcrypt.compare(password, repeatedPassword);
    },

    generateOTP: (otp_length) => {
        const minimum = Math.pow(10, otp_length - 1);
        const maximum = Math.pow(10, otp_length) - 1;
        return randomInt(minimum, maximum).toString();
    },

    generateID: () => uuidv4(),

    generateToken: (payload, secret, expiry) => {
        return jwt.sign(payload, secret, { expiresIn: expiry });
    },

    verifyToken: (token, secret) => {
        return jwt.verify(token, secret);
    },

    passwordPolicy: (password) => {
        const password_errors = [];
        const min_length = 8;
        const max_length = 16;
        if (password.length < min_length || password.length > max_length)
            password_errors.push("Password must be between 8 and 16 characters in length.");
        if (!/[a-z]/.test(password))
            password_errors.push("Password must include at least 1 lower case letter!");
        if (!/[A-Z]/.test(password))
            password_errors.push("Password must include at least 1 upper case letter!");
        if (!/[0-9]/.test(password))
            password_errors.push("Password must include at least 1 numeric digit!");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
            password_errors.push("Password must include at least 1 special character!");
        return password_errors;
    },

    getDomainFromURL: (urlString) => {
        try {
            const parsedURL = new URL(urlString);
            return parsedURL.hostname;
        } catch (error) {
            throw error;
        }
    },

    generateResetPasswordExpiry: (minutes) => {
        const time = dayjs().valueOf() + minutes * 60000;
        return dayjs(time);
    }
};