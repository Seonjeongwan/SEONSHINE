import express from "express";
import { UserRole } from "../constants/auth.js";
import {
  changeUserStatus,
  getRestaurantList,
  getUserDetail,
  getUserList,
  login,
  signUp,
  verifySignUp,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateChangeStatus } from "../middleware/validation/userValidate.js";
import { endpoints } from "./endpoints.js";

const userRouter = express.Router();

//TODO: Using validate user middleware
userRouter.post(endpoints.signUp, signUp);

userRouter.get(
  endpoints.users.list,
  authenticateToken({ role: UserRole.admin }),
  getUserList
);

userRouter.get(
  endpoints.users.restaurantList,
  authenticateToken({ role: UserRole.admin }),
  getRestaurantList
);

//TODO: Validate admin or current user can get detail
userRouter.get(endpoints.users.detail, authenticateToken(), getUserDetail)

userRouter.post(endpoints.login, login);

userRouter.post(endpoints.signUpVerification, verifySignUp);

userRouter.post(
  endpoints.users.changeStatus,
  authenticateToken({ role: UserRole.admin }),
  validateChangeStatus,
  changeUserStatus
);

export default userRouter;
