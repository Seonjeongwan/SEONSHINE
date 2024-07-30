import { CurrentUserType } from './user';

export type LoginResponseType = {
  message: string;
  user?: CurrentUserType;
  user_status: string;
  user_id: string;
};

export type SendOTPPayloadType = {
  email: string;
};

export type SendOTPResponseType = {
  message: string;
};

export type VerifyOTPPayloadType = {
  email: string;
  code: string;
};

export type VerifyOTPResponseType = {
  message: string;
  token: string;
};

export type ResetPasswordPayloadType = {
  password: string;
  token: string;
};

export type ResetPasswordResponseType = {
  message: string;
};
