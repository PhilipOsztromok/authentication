import dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

const config = {
    server:{
        port: process.env.PORT,
        url: process.env.SERVER_URL
    },

    database_url: process.env.DATABASE_URL,

    email: {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },
  security: {
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    rate_limit_window_ms: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
    rate_limit_max: parseInt(process.env.RATE_LIMIT_MAX)
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
  },

  client_url: process.env.CLIENT_URL || 'http://localhost:3000'
}

export default config;