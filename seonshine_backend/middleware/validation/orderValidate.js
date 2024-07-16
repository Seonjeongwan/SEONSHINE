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

  console.log("isValidDate :>> ", isValidDate);

  if (!isValidDate) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Invalid date" });
  }

  next();
};

export const validateOrderHistory = (req, res, next) => {
  const { from, to } = req.query;

  if (!from) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "From Date is required" });
  }

  if (!to) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "To Date is required" });
  }

  const isValidFromDate = dayjs(from, "YYYY-MM-DD", true).isValid();
  const isValidToDate = dayjs(to, "YYYY-MM-DD", true).isValid();

  if (!isValidFromDate) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Invalid From Date" });
  }

  if (!isValidToDate) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Invalid To Date" });
  }

  next();
};
