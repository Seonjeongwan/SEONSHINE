import { UseFormRegister } from 'react-hook-form';
import { SignUpSchemaType, SignUpVerifySchemaType } from './components/ProfileRegistration/schema';

export type SignUpStepsType = 'select_user_type' | 'enter_user_information' | 'verify_otp' | 'pending_approval';

export type EnterUserTypePropsType = {
  handleSubmitUserType: (user_type: string) => void;
};

export type EnterUserInformationPropsType = {
  handleSubmitInformation: (user_information: SignUpSchemaType) => void;
  userType: string;
};

export type AccountVerificationPageProps = {
  handleSubmitOtp: (verify_information: SignUpVerifySchemaType) => void;
  userEmail: string;
  title?: string;
  description?: string;
  secondsCountdown: number;
  handleResendOtp: (resetTimer: () => void) => void;
  className?: string;
  size?: 'small' | 'normal';
};
