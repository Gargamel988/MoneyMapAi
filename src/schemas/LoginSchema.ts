import { t } from 'i18next';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: t('login.error.emailRequired') })
    .email({ message: t('login.error.emailInvalid') })
    .max(100, { message: t('login.error.emailMax') })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: t('login.error.passwordRequired') })
    .min(8, { message: t('login.error.passwordMin') })
    .max(128, { message: t('login.error.passwordMax') }).trim(),
});

export type LoginFormData = z.infer<typeof LoginSchema>;