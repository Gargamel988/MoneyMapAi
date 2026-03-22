import i18next from "@/services/i18next";
import { advisorScheme } from "@/src/schemas/advisorScheme";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const parsedBody = JSON.parse(bodyText || "{}");
    const { transactions, language, stats } = parsedBody;

    const userLanguage = (language || "tr").split("-")[0];
    const t = i18next.getFixedT(userLanguage);

    if (!transactions || !Array.isArray(transactions)) {
      return Response.json(
        { error: "Transactions data is required" },
        { status: 400 },
      );
    }

    const systemPrompt = `
      You are an expert personal finance advisor. 
      Analyze the provided transaction data and provide concise, actionable, and encouraging feedback.
      
      Language: ${userLanguage}
      
      Focus on:
      1. Identifying spending spikes.
      2. Comparing spending against generic healthy budget ratios (e.g., 50/30/20 rule).
      3. Providing 3-5 clear insights and recommendations.
      4. Giving a financial health score.
    `;

    const userPrompt = `
      Here are the transactions for the last 30 days:
      ${JSON.stringify(transactions)}
      
      Total Income: ${stats?.totalIncome || "Unknown"}
      Total Expense: ${stats?.totalExpense || "Unknown"}
      
      Please provide your analysis.
    `;

    const result = streamObject({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      schema: advisorScheme,
      temperature: 0.4,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Advisor API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
