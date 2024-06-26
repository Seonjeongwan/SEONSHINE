import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';

export const menuListInfoSchema = zod.object({
  name: zod.string().min(1, { message: errorMessages.require }),
  file: zod.instanceof(File).nullable(),
});

export type MenuListInfoSchemaType = zod.infer<typeof menuListInfoSchema>;
