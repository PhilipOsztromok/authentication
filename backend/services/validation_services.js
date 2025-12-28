import Joi from 'joi';
import { EUserRole } from '../constants/application.js';
import { Schema } from 'mongoose';

export const signup_body = Joi.object({
    name: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().min(8).max(72).required(),
    phoneNumber: Joi.string().required(),
    consent: Joi.boolean(),
    role: Joi.string()
    .valid(...Object.values(EUserRole))
    .optional()
});

export const login_body = Joi.object({
    emailAddress: Joi.string().email().required(),
    password: Joi.string().min(8).max(72).required(),
});

export const validateJoiSchema = (Schema, values) => {
    const result = Schema.validate(values);
    return {
        value: result.value,
        error: result.error
    }
}

