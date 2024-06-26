import express from "express";
import { UserRole } from "../constants/auth.js";
import {
  assignRestaurantDate,
  getAllRestaurant,
  getRestaurantAssignList,
  getRestaurantDetail,
  getRestaurantList,
  updateRestaurant,
} from "../controllers/restaurantController.js";
import { authenticateToken } from "../middleware/auth.js";
import { endpoints } from "./endpoints.js";

const restaurantRouter = express.Router();

restaurantRouter.get(
  endpoints.restaurant.list,
  authenticateToken({ role: UserRole.admin }),
  getRestaurantList
);

restaurantRouter.get(
  endpoints.restaurant.all,
  authenticateToken({ role: UserRole.admin }),
  getAllRestaurant
);

restaurantRouter.get(
  endpoints.restaurant.assignList,
  authenticateToken(),
  getRestaurantAssignList
);


restaurantRouter.get(
  endpoints.restaurant.detail,
  authenticateToken({ role: UserRole.admin }),
  getRestaurantDetail
);

restaurantRouter.put(
  endpoints.restaurant.edit,
  authenticateToken(),
  updateRestaurant
);

restaurantRouter.post(
  endpoints.restaurant.assignDate,
  authenticateToken({ role: UserRole.admin }),
  assignRestaurantDate
);

export default restaurantRouter;
