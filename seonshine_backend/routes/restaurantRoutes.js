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
import {
  validateAssignRestaurantDate,
  validateUpdateRestaurant,
} from "../middleware/validation/restaurantValidate.js";
import {
  validateGetUserDetail,
  validateGetUserList,
} from "../middleware/validation/userValidate.js";
import { restaurantListSortKeys } from "../constants/validation.js";

const restaurantRouter = express.Router();

restaurantRouter.get(
  endpoints.restaurant.list,
  authenticateToken({ role: UserRole.admin }),
  validateGetUserList(restaurantListSortKeys),
  getRestaurantList
);

restaurantRouter.get(
  endpoints.restaurant.all,
  authenticateToken(),
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
  validateGetUserDetail,
  getRestaurantDetail
);

restaurantRouter.put(
  endpoints.restaurant.edit,
  authenticateToken(),
  validateUpdateRestaurant,
  updateRestaurant
);

restaurantRouter.post(
  endpoints.restaurant.assignDate,
  authenticateToken({ role: UserRole.admin }),
  validateAssignRestaurantDate,
  assignRestaurantDate
);

export default restaurantRouter;
