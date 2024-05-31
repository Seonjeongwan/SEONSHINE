import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';

export const LoginSchema = zod.object({
  employeeId: zod.string().trim().min(1, { message: errorMessages.require }),
  password: zod.string().min(1, { message: errorMessages.require }),
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;
