import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { otpRegex } from '@/constants/regex';

export const OtpSchema = zod.object({
  otp: zod.string().trim().regex(otpRegex, errorMessages.otpInvalid),
});

export type OtpSchemaType = zod.infer<typeof OtpSchema>;
