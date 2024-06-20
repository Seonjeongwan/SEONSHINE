import express from "express";
import { UserRole } from "../constants/auth.js";
import { getRestaurantDetail, getRestaurantList, updateRestaurant } from "../controllers/restaurantController.js";
import { authenticateToken } from "../middleware/auth.js";
import { endpoints } from "./endpoints.js";

const restaurantRouter = express.Router();

restaurantRouter.get(
  endpoints.restaurant.list,
  authenticateToken({ role: UserRole.admin }),
  getRestaurantList
);

restaurantRouter.get(
  endpoints.restaurant.detail,
  authenticateToken({ role: UserRole.admin }),
  getRestaurantDetail
);

restaurantRouter.put(endpoints.restaurant.edit, authenticateToken(), updateRestaurant);

export default restaurantRouter;
