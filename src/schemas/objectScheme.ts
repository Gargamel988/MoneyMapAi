import { z } from "zod";

export const objectScheme = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  products: z.array(
    z.object({
      itemName: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
  total: z.number(),
  date: z.string(),
  time: z.string(),
});
