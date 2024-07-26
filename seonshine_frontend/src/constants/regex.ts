import { errorMessages } from './errorMessages';

export const employeeIdRegex: RegExp = /^[a-zA-Z0-9]{8,20}$/;
export const passwordRegex: RegExp = /^[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]{8,50}$/;
export const otpRegex: RegExp = /^\d{6}$/;
export const digitRegex: RegExp = /^\d+$/;
export const phoneNumberRegex: RegExp = /^\d{10,15}$/;
export const validTimeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const passwordMinLength = 8;
export const passwordCriteria = [
  { regex: /[a-z]/, message: errorMessages.passwordLowerCase },
  { regex: /\d/, message: errorMessages.passwordDigit },
  { regex: /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]/, message: errorMessages.passwordSpecialChar },
];
