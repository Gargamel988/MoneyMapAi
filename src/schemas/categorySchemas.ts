import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Kategori adı gereklidir')
    .max(50, 'Kategori adı en fazla 50 karakter olabilir'),

  icon: z.string()
    .min(1, 'İkon seçimi gereklidir'),
  color: z.string()
    .min(1, 'Renk seçimi gereklidir'),
  type: z.enum(['gelir', 'gider']),
});

export const updateCategorySchema = categorySchema.partial().extend({
  id: z.number().positive('Geçerli bir kategori ID gerekli')
});

export type CategoryFormData = z.infer<typeof categorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
