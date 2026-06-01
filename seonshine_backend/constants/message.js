import { UserStatus } from "./auth.js";

export const statusWithMessageLogin = {
  [UserStatus.waitingConfirm]: "Admin confirmation needed",
  [UserStatus.active]: "Login successful",
  [UserStatus.inactive]: "Account reactivation needed",
  [UserStatus.inactiveByAdmin]: "Account suspended",
};

export const messageErrors = {
  idOrEmailExist: "User ID or Email already exists",
  verifyCodeIncorrect: "Incorrect verification code",
  verifyCodeExpires:
    "The verification code has expired. Please re-send the verification code to try again",
  verifyCodeTooManyAttempts:
    "Too many incorrect attempts. Please request a new verification code and try again",
  resendCooldown:
    "Please wait a moment before requesting another verification code",
  signupSessionExpired:
    "Your sign-up session has expired. Please sign up again",
  passwordPolicy: "Password must be between 6 and 50 characters long",
  incorrectIdPassword: "Incorrect id or password",
};
