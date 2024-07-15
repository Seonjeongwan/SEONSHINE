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

export const validationSignUpMessages = {
  roleIdRequired: "Role ID is required",
  usernameRequired: "Username is required",
  usernameMinLength: "Username must be at least 3 characters long",
  emailRequired: "Email is required",
  emailInvalid: "Invalid email address",
  passwordRequired: "Password is required",
  passwordMinLength: "Password must be at least 6 characters long",
  confirmPasswordMismatch: "Password confirmation does not match password",
  fullNameRequired: "Full name is required",
  phoneNumberRequired: "Phone number is required",
  phoneNumberInvalid: "Invalid phone number",
  branchIdRequired: "Branch ID is required",
  addressRequired: "Address is required for role ID 1",
};
