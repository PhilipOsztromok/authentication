import error_messages from "../constants/error_messages";

export default(error,req,status_code) => {
    const errorObject = {
        success: false,
        statusCode: status_code,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl,
        },
        message: error instanceof Error ? error.message || error_messages.ERROR.INTERNAL_SERVER_ERROR:error_messages.ERROR.INTERNAL_SERVER_ERROR,
        data: null,
        trace: error instanceof Error ? {Error:error.stack}:null
    } 

    return errorObject;
}