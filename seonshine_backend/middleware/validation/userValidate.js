import { UserStatus } from "../../constants/auth.js";
import { httpStatusCodes } from "../../constants/http.js";

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
