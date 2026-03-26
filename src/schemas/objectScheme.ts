import { z } from "zod";

export const objectScheme = z.object({
  isReceipt: z.boolean().describe("Whether the image is a receipt or invoice"),
  error: z.string().optional().describe("Explanation if the image is not a receipt"),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  products: z.array(
    z.object({
      itemName: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  ).optional().default([]),
  total: z.number().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
});
