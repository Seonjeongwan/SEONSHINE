import { RoleEnum } from '@/types/user';

import {
  ResendSignUpOtpSchemaType,
  SignUpSchemaType,
  SignUpVerifySchemaType,
} from './components/ProfileRegistration/schema';

export type SignUpStepsType = 'select_user_type' | 'enter_user_information' | 'verify_otp' | 'pending_approval';

export type EnterUserTypePropsType = {
  handleSubmitUserType: (user_type: RoleEnum) => void;
};

export type EnterUserInformationPropsType = {
  handleSubmitInformation: (user_information: SignUpSchemaType) => void;
  userType: RoleEnum;
};

export type AccountVerificationPageProps = {
  handleSubmitOtp: (verify_information: SignUpVerifySchemaType) => void;
  userEmail: string;
  title?: string;
  description?: string;
  secondsCountdown: number;
  handleResendOtp: (resetTimer: () => void, resend_information: ResendSignUpOtpSchemaType) => void;
  className?: string;
  size?: 'small' | 'normal';
};
