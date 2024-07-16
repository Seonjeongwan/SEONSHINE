import { ValidationError } from "sequelize";
import { httpStatusCodes } from "../../constants/http.js";
import SignUp from "../../models/signUpModel.js";

export const validateSignUp = async (req, res, next) => {
  const user = SignUp.build(req.body);

  try {
    await user.validate();
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      const validationErrors = error.errors.map((err) => err.message);
      console.log(error);
      return res
        .status(httpStatusCodes.badRequest)
        .json({ errors: validationErrors });
    }
  }
};
