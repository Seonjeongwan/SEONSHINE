import { weekdays } from '../../constants/common.js';
import { httpStatusCodes } from '../../constants/http.js';

export const validateAssignRestaurantDate = (req, res, next) => {
  const { weekday } = req.body;

  if (weekday !== 0 && !weekday) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: 'Weekday is required' });
  }

  const isValidWeekday = weekday in weekdays;

  if (!isValidWeekday) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: 'Invalid Weekday' });
  }

  next();
};
