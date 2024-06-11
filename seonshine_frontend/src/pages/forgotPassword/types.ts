export type ForgotPasswordStepsType = 'enter_email' | 'verify_otp' | 'enter_new_password' | 'reset_successfully';

export type EnterEmailPropsType = {
  handleSubmitEmail: (email: string) => void;
};

export type EnterNewPasswordPropsType = {
  handleSubmitPassword: (password: string) => void;
};
