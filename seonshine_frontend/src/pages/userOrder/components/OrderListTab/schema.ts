import { isValid, parseISO } from 'date-fns';
import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';

export const DateSchema = zod.object({
  date: zod
    .string()
    .trim()
    .min(1, { message: errorMessages.require })
    .refine(
      (value) => {
        const date = parseISO(value);
        return isValid(date);
      },
      {
        message: 'Invalid date format',
      },
    ),
  branch_id: zod.number(),
});

export type DateSchemaType = zod.infer<typeof DateSchema>;
