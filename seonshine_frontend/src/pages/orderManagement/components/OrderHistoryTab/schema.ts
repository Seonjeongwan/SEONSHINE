import { isAfter, isEqual, isValid, parseISO } from 'date-fns';
import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';

export const FromToDateSchema = zod
  .object({
    fromDate: zod
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
    toDate: zod
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
  })
  .refine(
    (data) => {
      const fromDate = parseISO(data.fromDate);
      const toDate = parseISO(data.toDate);
      return isAfter(toDate, fromDate) || isEqual(toDate, fromDate);
    },
    {
      message: 'toDate must be after or equal to fromDate',
      path: ['toDate'],
    },
  );

export type FromToDateSchemaType = zod.infer<typeof FromToDateSchema>;
