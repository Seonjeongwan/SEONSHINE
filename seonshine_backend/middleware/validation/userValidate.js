import { ValidationError } from "sequelize";
import { UserStatus } from "../../constants/auth.js";
import { httpStatusCodes } from "../../constants/http.js";
import User from "../../models/userModel.js";

export const validateChangeStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Status is required" });
  }

  if (!Object.values(UserStatus).includes(Number(status))) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Invalid status" });
  }

  next();
};

export const validateUser = async (req, res, next) => {
  // Create a temporary User instance to validate the input data
  const user = User.build(req.body);

  try {
    await user.validate();
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      const validationErrors = error.errors.map((err) => err.message);
      return res
        .status(httpStatusCodes.badRequest)
        .json({ errors: validationErrors });
    }
    next(error);
  }
};
