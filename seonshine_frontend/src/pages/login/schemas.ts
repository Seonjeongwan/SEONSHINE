import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { employeeIdRegex } from '@/constants/regex';

export const LoginSchema = zod.object({
  // employeeId: zod.string().trim().min(1, { message: errorMessages.require }),
  employeeId: zod
    .string()
    .trim()
    .refine((value) => employeeIdRegex.test(value), {
      message: errorMessages.employeeIdInvalid,
    }),
  password: zod.string().min(1, { message: errorMessages.require }),
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;
