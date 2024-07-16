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
  incorrectIdPassword: "Incorrect id or password",
};
