import * as zod from 'zod';

import { errorMessages } from '@/constants/errorMessages';
import { passwordCriteria, passwordMinLength, passwordRegex } from '@/constants/regex';

export const EmailSchema = zod.object({
  email: zod.string().email(),
});

export type EmailSchemaType = zod.infer<typeof EmailSchema>;

export const PasswordSchema = zod
  .object({
    password: zod
      .string()
      .min(1, { message: errorMessages.require })
      .min(passwordMinLength, { message: errorMessages.passwordMinLength })
      .superRefine((value, ctx) => {
        passwordCriteria.forEach(({ regex, message }) => {
          if (!regex.test(value)) {
            ctx.addIssue({
              code: zod.ZodIssueCode.custom,
              message,
            });
          }
        });
      }),
    confirmPassword: zod.string().min(1, { message: errorMessages.require }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: errorMessages.passwordNotMatch,
    path: ['confirmPassword'],
  });

export type PasswordSchemaType = zod.infer<typeof PasswordSchema>;
