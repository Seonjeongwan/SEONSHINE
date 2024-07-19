import { z } from 'zod';

import { validTimeFormatRegex } from '@/constants/regex';

export const orderPeriodSchema = z
  .object({
    startTime: z.string().regex(validTimeFormatRegex, 'Invalid time format'),
    endTime: z.string().regex(validTimeFormatRegex, 'Invalid time format'),
  })
  .refine(
    (data) => {
      const { startTime, endTime } = data;
      return endTime > startTime;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    },
  );

export type OrderPeriodSchemaType = z.infer<typeof orderPeriodSchema>;
