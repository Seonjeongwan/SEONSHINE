import { httpStatusCodes } from "../../constants/http.js";
import { validTimeFormatRegex } from "../../constants/regex.js";

export const validateSaveOrderPeriod = (req, res, next) => {
  const { start, end } = req.body;

  if (!start) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "Start time is required" });
  }

  if (!end) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: "End time is required" });
  }

  if (!validTimeFormatRegex.test(start) || !validTimeFormatRegex.test(end)) {
    return res
      .status(400)
      .json({ error: 'Invalid time format. Expected "hh:mm".' });
  }

  if (start >= end) {
    return res
      .status(400)
      .json({ error: "Start time must be before end time." });
  }

  next();
};
