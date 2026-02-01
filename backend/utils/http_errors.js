import errorObject from "./errorObject.js";

export default (next, error, req, status_code) => {
  const errorObj = errorObject(error, req, status_code);
  return next(errorObj);
};
