import { isValid, parse } from 'date-fns';
import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { phoneNumberRegex } from '@/constants/regex';

export const restaurantInfoSchema = zod.object({
  username: zod.string().min(1, { message: errorMessages.require }),
  address: zod.string().min(1, { message: errorMessages.require }),
  phone_number: zod
    .string()
    .min(1, { message: errorMessages.require })
    .refine((value) => phoneNumberRegex.test(value), {
      message: errorMessages.phoneNumberInvalid,
    }),
});

export type RestaurantInfoSchemaType = zod.infer<typeof restaurantInfoSchema>;
