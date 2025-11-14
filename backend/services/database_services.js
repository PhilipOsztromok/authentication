import mongoose, { connect } from "mongoose";
import config from "../config/config.js";

export default {
    connect: async () => {
        try {
            await mongoose.connect(config.database_url);

            return mongoose.connection;

        } catch (error) {
            throw error;
        }
    },


}