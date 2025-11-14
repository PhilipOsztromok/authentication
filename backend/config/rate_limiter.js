import { RateLimiterMongo } from 'rate-limiter-flexible';
import config from './config.js';

export let rateLimiterMongo = null;

export const initRateLimiter = (mongooseConnection) => {
  rateLimiterMongo = new RateLimiterMongo({
    storeClient: mongooseConnection,
    points: config.security.rate_limit_max,
    duration: Math.floor(config.security.rate_limit_window_ms / 1000 ),
  });
};

