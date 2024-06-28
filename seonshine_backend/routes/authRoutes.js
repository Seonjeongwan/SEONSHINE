import express from "express";
import { changePassword, login, resendOtpForgotPassword, resendOtpSignUp, sendOtpForgotPassword, signUp, verifyOtpForgotPassword, verifySignUp } from "../controllers/authController.js";
import { endpoints } from "./endpoints.js";

const authRouter = express.Router();

//TODO: Using validate user middleware
authRouter.post(endpoints.auth.signup.index, signUp);

authRouter.post(endpoints.auth.login, login);

authRouter.post(endpoints.auth.signup.verification, verifySignUp);

authRouter.post(endpoints.auth.signup.resendOtp, resendOtpSignUp);

authRouter.post(endpoints.auth.forgotPassword.sendOtp, sendOtpForgotPassword);

authRouter.post(endpoints.auth.forgotPassword.resendOtp, resendOtpForgotPassword);

authRouter.post(endpoints.auth.forgotPassword.verifyOtp, verifyOtpForgotPassword);

authRouter.post(endpoints.auth.forgotPassword.changePassword, changePassword);

export default authRouter;
