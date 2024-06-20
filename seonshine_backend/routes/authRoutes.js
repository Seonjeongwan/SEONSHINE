import express from "express";
import { login, signUp, verifySignUp } from "../controllers/authController.js";
import { endpoints } from "./endpoints.js";

const authRouter = express.Router();

//TODO: Using validate user middleware
authRouter.post(endpoints.signUp, signUp);

authRouter.post(endpoints.login, login);

authRouter.post(endpoints.signUpVerification, verifySignUp);

export default authRouter;
