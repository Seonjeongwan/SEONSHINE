import { QueryTypes } from "sequelize";
import { UserRole, UserStatus } from "../constants/auth.js";
import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import { sequelizeUserDb } from "../db/dbConfig.js";
import { User, UserProfile } from "../models/index.js";
import RestaurantAssigned from "../models/restaurantAssignedModel.js";

export const getRestaurantList = async (req, res) => {
  const {
    page_size = 25,
    page_number = 1,
    sort_key = "updated_at",
    sort_type = "asc",
    user_id = "",
    username = "",
  } = req.query;
  const offset = (page_number - 1) * page_size;
  const select =
    "SELECT u.user_id, u.username, u.user_status, GROUP_CONCAT(r.weekday ORDER BY r.weekday ASC SEPARATOR ', ') AS weekday FROM user_db.users u LEFT JOIN restaurant_db.restaurant_assigned r ON u.user_id = r.restaurant_id";
  const where =
    "WHERE user_status IN(:user_status) AND role_id = 2 AND user_id LIKE :user_id AND username LIKE :username";
  const groupBy = "GROUP BY user_id";
  const sorting = `ORDER BY ${sort_key} ${sort_type.toUpperCase()}`;
  const paging = "LIMIT :page_size OFFSET :offset";
  const query = `${select} ${where} ${groupBy} ${sorting} ${paging}`;

  const countSelect = `SELECT COUNT(*) AS total FROM user_db.users`;
  const countQuery = `${countSelect} ${where}`;
  const queryParams = {
    page_size: Number(page_size),
    offset: Number(offset),
    user_id: `%${user_id}%`,
    username: `%${username}%`,
    user_status: [
      UserStatus.active,
      UserStatus.inactive,
      UserStatus.inactiveByAdmin,
    ],
  };

  try {
    const users = await sequelizeUserDb.query(query, {
      replacements: queryParams,
      type: QueryTypes.SELECT,
    });

    const countResult = await sequelizeUserDb.query(countQuery, {
      replacements: queryParams,
      type: QueryTypes.SELECT,
    });

    const totalRecords = countResult?.[0]?.total || 0;

    res.status(httpStatusCodes.success).send({
      data: users,
      page_number,
      page_size,
      sort_key,
      sort_type,
      total: totalRecords,
    });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

export const getAllRestaurant = async (req, res) => {
  try {
    const restaurants = await User.findAll({
      attributes: ["user_id", "username"],
      where: {
        role_id: 2,
        user_status: 1,
      },
      include: {
        model: UserProfile,
        as: "profile",
        attributes: ["address"],
      },
      raw: true,
      nest: true,
    });

    const restaurantsResponse = (restaurants || []).map((restaurant) => {
      const restaurantData = {
        ...restaurant,
        ...restaurant.profile,
      };
      delete restaurantData.profile;
      return restaurantData;
    });
    res.status(httpStatusCodes.success).send(restaurantsResponse);
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const getRestaurantDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await User.findOne({
      where: { user_id: id },
      attributes: [
        "user_id",
        "role_id",
        "username",
        "email",
        "phone_number",
        "user_status",
      ],
      include: {
        model: UserProfile,
        as: "profile",
        attributes: ["address", "profile_picture_url"],
      },
      raw: true,
      nest: true,
    });

    if (!restaurant) {
      return res
        .status(httpStatusCodes.badRequest)
        .json({ message: "Restaurant not found" });
    }

    const restaurantData = {
      ...restaurant,
      ...restaurant.profile,
    };
    delete restaurantData.profile;

    const restaurantAssigned = await RestaurantAssigned.findOne({
      attributes: ["weekday"],
      where: { restaurant_id: id },
      raw: true,
    });

    //TODO: Check cannot get weekday
    restaurantData.weekday = restaurantAssigned?.weekday || null;

    res.status(httpStatusCodes.success).json(restaurantData);
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const updateRestaurant = async (req, res) => {
  const userId = req.params.id;
  const { username, address, phone_number } = req.body;
  const transactionUserDb = await sequelizeUserDb.transaction();

  try {
    const user = await User.findOne({
      where: { user_id: userId, role_id: UserRole.restaurant },
      transaction: transactionUserDb,
    });

    if (!user) {
      res.status(httpStatusCodes.badRequest).json({ error: "User not found" });
    }

    const userUpdates = {
      username,
      phone_number,
    };

    await user.update(userUpdates, { transaction: transactionUserDb });

    const profileUpdates = {
      address,
    };

    const profile = await UserProfile.findOne({
      where: {
        user_id: userId,
      },
    });

    if (profile) {
      await profile.update(profileUpdates, {
        transaction: transactionUserDb,
      });
    } else {
      const profile = {
        ...profileUpdates,
        user_id: userId,
      };
      await UserProfile.create(profile, { transaction: transactionUserDb });
    }

    await transactionUserDb.commit();

    res
      .status(httpStatusCodes.success)
      .json({ message: "Updated successfully" });
  } catch (error) {
    await transactionUserDb.rollback();
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const getRestaurantAssignList = async (req, res) => {
  try {
    const assignedList = await RestaurantAssigned.findAll({
      attributes: ["weekday", "restaurant_id"],
    });
    res.status(httpStatusCodes.success).json(assignedList);
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const assignRestaurantDate = async (req, res) => {
  const { weekday, restaurant_id } = req.body;
  try {
    const restaurantByDate = await RestaurantAssigned.findOne({
      attributes: ["weekday"],
      where: { weekday: weekday },
    });

    if (restaurantByDate) {
      if (restaurant_id) {
        await restaurantByDate.update({
          restaurant_id,
        });
      } else {
        await restaurantByDate.destroy();
      }
    } else {
      await RestaurantAssigned.create({
        weekday,
        restaurant_id,
      });
    }

    res
      .status(httpStatusCodes.success)
      .json({ message: "Updated successfully" });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

//TODO: Run batch script every date for inserting current day to assign date history for tracking and return exact restaurant name for specific date in the past