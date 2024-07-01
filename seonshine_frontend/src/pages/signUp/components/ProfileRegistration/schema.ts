import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { employeeIdRegex, otpRegex, passwordRegex, phoneNumberRegex } from '@/constants/regex';
import { RoleEnum } from '@/types/user';

export const SignUpSchema = zod
  .object({
    userType: zod.nativeEnum(RoleEnum),
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
    email: zod.string(),
    phoneNumber: zod
      .string()
      .min(1, { message: errorMessages.require })
      .refine((value) => phoneNumberRegex.test(value), {
        message: errorMessages.phoneNumberInvalid,
      }),
    branch_id: zod.union([zod.string(), zod.number()]),
    address: zod.string(),
  })
  .refine((data) => data.userType !== RoleEnum.USER || (data.userType === RoleEnum.USER && data.branch_id), {
    message: 'Branch field is required',
    path: ['branch_id'],
  })
  .refine((data) => data.userType !== RoleEnum.RESTAURANT || (data.userType === RoleEnum.RESTAURANT && data.address), {
    message: 'Address field is required',
    path: ['address'],
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: errorMessages.passwordNotMatch,
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.userType === RoleEnum.USER) {
        if (typeof data.email === 'string' && data.email.includes('@gmail.com')) {
          return false;
        }
        return typeof data.email === 'string';
      } else {
        const emailSchema = zod.string().email({ message: errorMessages.emailInvalid });
        const result = emailSchema.safeParse(data.email);
        return result.success;
      }
    },
    {
      message: errorMessages.emailInvalid,
      path: ['email'],
    },
  );

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export type SignUpVerifySchemaType = {
  code: string;
  email: string;
};

export type ResendSignUpOtpSchemaType = {
  email: string;
};

export const OtpSchema = zod.object({
  otp: zod.string().trim().regex(otpRegex, 'OTP must have 6 digits'),
});

export type OtpSchemaType = zod.infer<typeof OtpSchema>;
