import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { employeeIdRegex, otpRegex, passwordRegex, phoneNumberRegex } from '@/constants/regex';

export const SignUpSchema = zod
  .object({
    employeeId: zod
      .string()
      .trim()
      .min(1, { message: errorMessages.require })
      .refine((value) => employeeIdRegex.test(value), {
        message: errorMessages.employeeIdInvalid,
      }),
    password: zod
      .string()
      .min(1, { message: errorMessages.require })
      .refine((value) => passwordRegex.test(value), {
        message: errorMessages.passwordInvalid,
      }),
    confirmPassword: zod.string(),
    fullName: zod.string().min(1, { message: errorMessages.require }),
    email: zod.string().email({ message: errorMessages.emailInvalid }),
    phoneNumber: zod
      .string()
      .min(1, { message: errorMessages.require })
      .refine((value) => phoneNumberRegex.test(value), {
        message: errorMessages.phoneNumberInvalid,
      }),
    branchName: zod.string().min(1, { message: errorMessages.require }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: errorMessages.passwordNotMatch,
      path: ['confirmPassword'],
    },
  );

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const OtpSchema = zod.object({
  otp: zod.string().trim().regex(otpRegex, 'OTP must have 6 digits'),
});

export type OtpSchemaType = zod.infer<typeof OtpSchema>;
