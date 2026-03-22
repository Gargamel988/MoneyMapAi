import { z } from "zod";

export const advisorScheme = z.object({
  summary: z.string().describe("A brief summary of the user's financial status for the period."),
  insights: z.array(z.string()).describe("List of key observations about spending habits."),
  recommendations: z.array(z.string()).describe("Actionable advice to improve financial health."),
  financialHealthScore: z.number().min(1).max(100).describe("A score from 1 to 100 representing the user's financial discipline."),
  warningCategories: z.array(z.object({
    category: z.string(),
    reason: z.string(),
    percentageIncrease: z.number().optional()
  })).describe("Categories where spending is unusually high or increasing.")
});

export type AdvisorResponse = z.infer<typeof advisorScheme>;
