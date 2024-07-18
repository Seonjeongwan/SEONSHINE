import dayjs from "dayjs";
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

  const startTime = dayjs(`1970-01-01T${start}:00`);
  const endTime = dayjs(`1970-01-01T${end}:00`);

  if (startTime.isAfter(endTime) || startTime.isSame(endTime)) {
    return res
      .status(400)
      .json({ error: "Start time must be before end time." });
  }

  next();
};
