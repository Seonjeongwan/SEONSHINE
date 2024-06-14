import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { otpRegex } from '@/constants/regex';

export const VerifyOtpSchema = zod.object({
  code: zod.string().trim().regex(otpRegex, errorMessages.otpInvalid),
  email: zod.string().email(errorMessages.emailInvalid),
});

export type VerifyOtpSchemaType = zod.infer<typeof VerifyOtpSchema>;
