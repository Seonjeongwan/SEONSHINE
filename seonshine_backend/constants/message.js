import { UserStatus } from "./auth.js";

export const statusWithMessageLogin = {
  [UserStatus.waitingConfirm]: "Admin confirmation needed",
  [UserStatus.active]: "Login successful",
  [UserStatus.inactive]: "Account reactivation needed",
  [UserStatus.deleted]: "Account suspended",
};

export const messageErrors = {
  idOrEmailExist: "User ID or Email already exists",
};