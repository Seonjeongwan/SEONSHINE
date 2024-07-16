import dayjs from "dayjs";
import { httpStatusCodes } from "../../constants/http.js";
import { nonNegativeIntegerRegex } from "../../constants/regex.js";

export const validateOrderList = (req, res, next) => {
  const { date, branch_id } = req.query;

  if (!date) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Date is required" });
  }

  const isValidDate = dayjs(date, "YYYY-MM-DD", true).isValid();

  if (!isValidDate) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Invalid date" });
  }

  if (
    (branch_id || branch_id === 0) &&
    !nonNegativeIntegerRegex.test(branch_id)
  ) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Branch id must be a non-negative integer" });
  }

  next();
};
