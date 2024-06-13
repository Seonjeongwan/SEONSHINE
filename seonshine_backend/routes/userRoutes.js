import express from "express";
import { UserRole } from "../constants/auth.js";
import {
  getUserList,
  login,
  signUp,
  verifySignUp,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";
import { endpoints } from "./endpoints.js";

const userRouter = express.Router();

userRouter.post(endpoints.signUp, signUp);
userRouter.get(
  endpoints.users.list,
  authenticateToken({ role: UserRole.admin }),
  getUserList
);
userRouter.post(endpoints.login, login);
userRouter.post(endpoints.signUpVerification, verifySignUp);
// router.post("/check-id-email", checkIdEmail);
// router.post("/confirm_signin", confirmSignin);

export default userRouter;
