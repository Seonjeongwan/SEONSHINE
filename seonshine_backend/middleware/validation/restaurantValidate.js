import { httpStatusCodes } from '../../constants/http.js';

export const validateAssignRestaurantDate = (req, res, next) => {
  const { weekday } = req.body;

  if (!weekday) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: 'Weekday is required' });
  }

  const isValidWeekday = weekday >= 1 && weekday <= 5;

  if (!isValidWeekday) {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ error: 'Invalid Weekday' });
  }

  next();
};
