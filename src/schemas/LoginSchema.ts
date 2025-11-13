import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email adresi zorunludur' })
    .email({ message: 'Geçerli bir email adresi giriniz' })
    .max(100, { message: 'Email adresi en fazla 100 karakter olmalıdır' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: 'Şifre zorunludur' })
    .min(8, { message: 'Şifre en az 8 karakter olmalıdır' })
    .max(128, { message: 'Şifre en fazla 128 karakter olmalıdır' }).trim(),
});

export type LoginFormData = z.infer<typeof LoginSchema>;