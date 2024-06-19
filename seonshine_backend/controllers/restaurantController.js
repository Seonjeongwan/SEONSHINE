import { QueryTypes } from "sequelize";
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
    "SELECT u.user_id, u.username, u.user_status, r.weekday FROM user_db.users u LEFT JOIN restaurant_db.restaurant_assigned r ON u.user_id = r.restaurant_id";
  const where =
    "WHERE user_status IN(:user_status) AND role_id = 2 AND user_id LIKE :user_id AND username LIKE :username";
  const sorting = `ORDER BY ${sort_key} ${sort_type.toUpperCase()}`;
  const paging = "LIMIT :page_size OFFSET :offset";
  const query = `${select} ${where} ${sorting} ${paging}`;

  const countSelect = `SELECT COUNT(*) AS total FROM user_db.users`;
  const countQuery = `${countSelect} ${where}`;
  const queryParams = {
    page_size: Number(page_size),
    offset: Number(offset),
    user_id: `%${user_id}%`,
    username: `%${username}%`,
    user_status: ["1", "2", "9"],
  };

  try {
    const users = await sequelizeUserDb.query(query, {
      replacements: queryParams,
      type: QueryTypes.SELECT,
    });

    const usersWithoutPassword = users.map((user) => {
      delete user.password_hash;
      return user;
    });

    const countResult = await sequelizeUserDb.query(countQuery, {
      replacements: queryParams,
      type: QueryTypes.SELECT,
    });

    const totalRecords = countResult?.[0]?.total || 0;

    res.status(httpStatusCodes.success).send({
      data: usersWithoutPassword,
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
      raw: true
    });

    restaurantData.weekday = restaurantAssigned?.weekday || null;

    res.status(httpStatusCodes.success).json(restaurantData);
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};
