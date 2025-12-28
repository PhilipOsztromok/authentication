import config from "../config/config.js";
import { EApplicationEnvironment } from "../constants/application.js";
import error_messages from "../constants/error_messages.js";
import { rateLimiterMongo } from '../config/rate_limiter.js';


export default (req, _, next) => {
    if (config.env === EApplicationEnvironment.DEVELOPMENT) {
        return next();
    }

    if (rateLimiterMongo) {
        rateLimiterMongo
            .consume(req.ip, 1)
            .then(() => next())
            .catch(() => {
                httpError(next, new Error(error_messages.ERROR.TOO_MANY_REQUESTS), req, 429);
            });
    }
};