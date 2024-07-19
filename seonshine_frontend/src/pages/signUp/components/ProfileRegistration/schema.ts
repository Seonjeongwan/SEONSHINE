import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { employeeIdRegex, otpRegex, phoneNumberRegex } from '@/constants/regex';
import { RoleEnum } from '@/types/user';

const passwordMinLength = 8;
const passwordCriteria = [
  { regex: /[a-z]/, message: errorMessages.passwordLowerCase },
  { regex: /[A-Z]/, message: errorMessages.passwordUpperCase },
  { regex: /\d/, message: errorMessages.passwordDigit },
  { regex: /[@$!%*?&]/, message: errorMessages.passwordSpecialChar },
];

export const SignUpSchema = zod
  .object({
    userType: zod.nativeEnum(RoleEnum),
    employeeId: zod.string().trim().min(1, { message: errorMessages.require }),
    password: zod
      .string()
      .min(1, { message: errorMessages.require })
      .min(passwordMinLength, { message: errorMessages.passwordMinLength })
      .superRefine((value, ctx) => {
        passwordCriteria.forEach(({ regex, message }) => {
          if (!regex.test(value)) {
            ctx.addIssue({
              code: zod.ZodIssueCode.custom,
              message,
            });
          }
        });
      }),
    confirmPassword: zod.string().min(1, { message: errorMessages.require }),
    fullName: zod.string().min(1, { message: errorMessages.require }),
    email: zod.string().min(1, { message: errorMessages.require }),
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
    message: 'This field is required',
    path: ['branch_id'],
  })
  .refine((data) => data.userType !== RoleEnum.RESTAURANT || (data.userType === RoleEnum.RESTAURANT && data.address), {
    message: 'This field is required',
    path: ['address'],
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: errorMessages.passwordNotMatch,
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.userType === RoleEnum.RESTAURANT) {
        return employeeIdRegex.test(data.employeeId);
      }
      return true;
    },
    {
      message: errorMessages.idInvalid,
      path: ['employeeId'],
    },
  )
  .refine(
    (data) => {
      if (data.userType === RoleEnum.USER) {
        return employeeIdRegex.test(data.employeeId);
      }
      return true;
    },
    {
      message: errorMessages.employeeIdInvalid,
      path: ['employeeId'],
    },
  )
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
