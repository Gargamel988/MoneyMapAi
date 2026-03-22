import { transactionsApi } from './transactions';
import { generateAPIUrl } from '../utils/utils';
import { AdvisorResponse } from '../schemas/advisorScheme';

export const aiAdvisorApi = {
  getAdvice: async (language: string = 'en'): Promise<AdvisorResponse> => {
    try {
      // 1. Fetch transactions for the last 30 days
      const transactions = await transactionsApi.getTransactionsByMonth();
      
      if (!transactions || transactions.length === 0) {
        throw new Error("No transactions found to analyze.");
      }

      // 2. Summarize data to save tokens and provide better context
      const summary = transactions.reduce((acc: any, t: any) => {
        const categoryName = t.categories?.name || 'Other';
        const type = t.type; // 'gelir' or 'gider'
        const amount = parseFloat(t.amount || 0);

        if (!acc.categories[categoryName]) {
          acc.categories[categoryName] = { total: 0, count: 0, type };
        }
        acc.categories[categoryName].total += amount;
        acc.categories[categoryName].count += 1;

        if (type === 'gelir') acc.totalIncome += amount;
        else acc.totalExpense += amount;

        return acc;
      }, { categories: {}, totalIncome: 0, totalExpense: 0 });

      // 3. Prepare payload
      const payload = {
        transactions: Object.entries(summary.categories).map(([name, data]: [string, any]) => ({
          category: name,
          total: data.total,
          count: data.count,
          type: data.type
        })),
        stats: {
          totalIncome: summary.totalIncome,
          totalExpense: summary.totalExpense
        },
        language
      };

      // 4. Call Advisor API
      const apiUrl = generateAPIUrl("/api/advisor");
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get advice from AI");
      }

      return await response.json();
    } catch (error: any) {
      console.error("AI Advisor Error:", error);
      throw error;
    }
  }
};
