import { ValidationError } from 'sequelize';
import { weekdays } from '../../constants/common.js';
import { httpStatusCodes } from '../../constants/http.js';
import UpdateRestaurant from '../../models/updateRestaurantModel.js';

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

export const validateUpdateRestaurant = async (req, res, next) => {
  const dataUpdateRestaurant = UpdateRestaurant.build(req.body);

  try {
    await dataUpdateRestaurant.validate();
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      const validationErrors = error.errors.map((err) => err.message);
      return res
        .status(httpStatusCodes.badRequest)
        .json({ errors: validationErrors });
    }
  }
};
