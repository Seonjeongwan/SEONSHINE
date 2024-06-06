import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { employeeIdRegex, otpRegex, passwordRegex } from '@/constants/regex';

export const LoginSchema = zod.object({
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
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;

export const OtpSchema = zod.object({
  otp: zod.string().trim().regex(otpRegex, 'OTP must have 6 digits'),
});

export type OtpSchemaType = zod.infer<typeof OtpSchema>;
