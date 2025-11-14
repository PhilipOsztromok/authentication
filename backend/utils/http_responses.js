export default (req,resp,status_code,response_message,data=null) => {
    const response = {
        success: true,
        statusCode: status_code,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl,
        },
        message: response_message,
        data: data
    }
    resp.status(status_code).json(response);
}

