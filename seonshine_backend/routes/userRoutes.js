import express from "express";
import { UserRole } from "../constants/auth.js";
import {
  changeUserStatus,
  getRestaurantList,
  getUserList,
  login,
  signUp,
  verifySignUp,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateChangeStatus } from "../middleware/validation/userValidate.js";
import { endpoints } from "./endpoints.js";

const userRouter = express.Router();

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
userRouter.post(endpoints.login, login);
userRouter.post(endpoints.signUpVerification, verifySignUp);
userRouter.post(
  endpoints.users.changeStatus,
  authenticateToken({ role: UserRole.admin }),
  validateChangeStatus,
  changeUserStatus
);

export default userRouter;
