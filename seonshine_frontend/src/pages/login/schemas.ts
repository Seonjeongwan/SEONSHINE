import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { employeeIdRegex, passwordRegex } from '@/constants/regex';

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
