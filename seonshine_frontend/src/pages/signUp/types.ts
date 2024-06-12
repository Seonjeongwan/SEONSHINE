export type SignUpStepsType = 'select_user_type' | 'enter_user_information' | 'verify_otp' | 'pending_approval';

export type EnterUserTypePropsType = {
  handleSubmitUserType: (user_type: string) => void;
};

export type EnterUserInformationPropsType = {
  handleSubmitInformation: (user_information: object) => void;
};
