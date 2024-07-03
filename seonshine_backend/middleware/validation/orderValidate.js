import dayjs from "dayjs";
import { httpStatusCodes } from "../../constants/http.js";

export const validateOrderList = (req, res, next) => {
  const { date } = req.query;

  if (!date) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Date is required" });
  }

  const isValidDate = dayjs(date, "YYYY-MM-DD", true).isValid();

  console.log('isValidDate :>> ', isValidDate);

  if (!isValidDate) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Invalid date" });
  }

  next();
};