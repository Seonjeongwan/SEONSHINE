import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";

export const getResponseErrors = (error) => {
  let response = {
    status: httpStatusCodes.internalServerError,
    errors: httpStatusErrors.internalServerError
  }
  if (error.name === "SequelizeValidationError") {
    const errors = error.errors.map((err) => err.message);
    response = {
      status: httpStatusCodes.badRequest,
      errors: errors,
    };
  }
  return response;
};
