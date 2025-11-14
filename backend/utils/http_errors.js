import errorObject from "./errorObject"

export default (next,error,req,status_code) => {
    const errorObject = errorObject(error,req,status_code);
    return next(errorObject);
}