import mongoose from "mongoose";
import { EUserRole } from "../constants/application";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 72
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        id: false,
        isoCode: {
            type: String,
            required: true
        },
        internationalNumber: {
            type: String,
            required: true
        }
    },
    password: {
        type: String,
        required: true
    },
    accountConfirmation: {
        _id: false,
        status: {
            type: Boolean,
            default: false,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        }
    },
    passwordReset: {
        _id: false,
        token: {
            type: String,
            default: null
        },
        expiry: {
            type: Number,
            default: null
        },
        lastResetAt: {
            type: Date,
            default: null
        }
    },
    consent: { 
        type: Boolean, 
        required: true 
    },
    role: { type: String, 
        enum: EUserRole, 
        required: true, 
        default: EUserRole.USER 
    },
    isActive: {
        type: Boolean, 
        default: false
    },
    userLocation:{
        lat: {
            type: Number, 
            default: null,
            required: true
        },
        long: {
            type: Number, 
            default: null,
            required: true
        }
    },
    lastLogin: { 
        type: Date,
        default: null
    }

},{ timestamps: true })

userSchema.index({ isActive: 1 });
userSchema.index({ role: 1 });
userSchema.index({ lastLogin: -1 });

export default mongoose.model('User', userSchema)
