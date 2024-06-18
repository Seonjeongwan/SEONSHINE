import { isValid, parse } from 'date-fns';
import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { phoneNumberRegex } from '@/constants/regex';

export const userInfoSchema = zod.object({
  full_name: zod.string().min(1, { message: errorMessages.require }),
  birth_date: zod
    .string()
    .min(1, { message: errorMessages.require })
    .refine(
      (value) => {
        const date = parse(value, 'dd/MM/yyyy', new Date());
        return isValid(date);
      },
      {
        message: 'Invalid date format',
      },
    ),
  address: zod.string().min(1, { message: errorMessages.require }),
  phone_number: zod
    .string()
    .min(1, { message: errorMessages.require })
    .refine((value) => phoneNumberRegex.test(value), {
      message: errorMessages.phoneNumberInvalid,
    }),
});

export type UserInfoSchema = zod.infer<typeof userInfoSchema>;
