import express from "express";
import { login, signUp, signUpResendOtp, verifySignUp } from "../controllers/authController.js";
import { endpoints } from "./endpoints.js";

const authRouter = express.Router();

//TODO: Using validate user middleware
authRouter.post(endpoints.signUp, signUp);

authRouter.post(endpoints.login, login);

authRouter.post(endpoints.signUpVerification, verifySignUp);

authRouter.post(endpoints.signUpResendOtp, signUpResendOtp);

export default authRouter;
