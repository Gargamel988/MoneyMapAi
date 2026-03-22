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
      boundingBox: z.object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
      }).optional(),
    })
  ),
  total: z.number(),
  date: z.string(),
  time: z.string(),
});
