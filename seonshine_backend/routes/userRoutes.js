import express from 'express';
import { getAllUsers, login, signUp } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.get("/getAll", getAllUsers);
userRouter.post("/login", login);
// router.post("/check-id-email", checkIdEmail);
// router.post("/confirm_signin", confirmSignin);

export default userRouter;