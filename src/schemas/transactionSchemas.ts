// lib/income-expense-schemas.ts
import { z } from 'zod';

// Ortak time validasyonu
const timeSchema = z
  .string()
  .trim()

// Income Schema
export const incomeSchema = z.object({
  category_id: z.string().min(1, 'Kategori seçiniz'),
  total_amount: z
    .number()
    .min(0.01, 'Tutar 0\'dan büyük olmalı')
    .max(999999999, 'Tutar çok büyük'),
  date: z.date(),
  time: timeSchema,
  description: z
    .string()
    .trim()
    .max(500, 'Açıklama en fazla 500 karakter olabilir')
    .optional()
});

export type IncomeFormData = z.infer<typeof incomeSchema>;

// Expense Schema
export const expenseSchema = z.object({
  category_id: z.string().min(1, 'Kategori seçmek zorunludur'),
  urun: z
    .array(
      z.object({
        itemName: z.string().min(1, 'Ürün adı gereklidir').trim(),
        price: z.number().positive('Fiyat 0\'dan büyük olmalıdır'),
        quantity: z.number().positive('Adet 0\'dan büyük olmalıdır'),
      })
    )
    .min(1, 'En az bir ürün eklemelisiniz'),
  date: z.date(),
  time: timeSchema,
  description: z
    .string()
    .trim()
    .max(500, 'Açıklama en fazla 500 karakter olabilir')
    .optional()
});

export type ExpenseData = z.infer<typeof expenseSchema>;