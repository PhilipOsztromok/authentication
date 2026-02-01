export default (err, req, res, next) => {
    console.error('[ERROR] Global Error Handler:', err); // Log the full error

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
        request: err.request || {
            ip: req.ip,
            method: req.method,
            url: req.originalUrl
        },
        trace: process.env.NODE_ENV === 'development' ? err.trace || err.stack : null
    });
};
