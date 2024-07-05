import { isValid, parseISO } from 'date-fns';
import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { phoneNumberRegex } from '@/constants/regex';

export const userInfoSchema = zod.object({
  username: zod.string().min(1, { message: errorMessages.require }),
  birth_date: zod
    .string()
    .refine(
      (value) => {
        const date = parseISO(value);
        return isValid(date);
      },
      {
        message: 'Invalid date format',
      },
    )
    .nullable(),
  branch_id: zod.number(),
  address: zod.string().nullable(),
  phone_number: zod
    .string()
    .min(1, { message: errorMessages.require })
    .refine((value) => phoneNumberRegex.test(value), {
      message: errorMessages.phoneNumberInvalid,
    }),
});

export type UserInfoSchemaType = zod.infer<typeof userInfoSchema>;
