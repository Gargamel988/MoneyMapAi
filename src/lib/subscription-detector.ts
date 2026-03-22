import { Transaction, TransactionList } from '../types/transactionTypes';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  lastDate: string;
  nextDate: string;
  frequency: 'monthly' | 'yearly';
  probability: number; // 0 to 1
}

export const detectSubscriptions = (transactions: TransactionList): Subscription[] => {
  const giderler = transactions.filter(t => t.type === 'gider');
  const groups: { [key: string]: Transaction[] } = {};

  // 1. Group by category and amount (rounded to avoid small differences)
  giderler.forEach(t => {
    const key = `${t.category_id}_${Math.round(t.total_amount)}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  const subscriptions: Subscription[] = [];

  Object.values(groups).forEach(group => {
    if (group.length < 2) return;

    // Sort by date
    const sorted = [...group].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Check intervals (roughly 28-32 days)
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const d1 = new Date(sorted[i-1].date);
      const d2 = new Date(sorted[i].date);
      const diffDays = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(diffDays);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const isMonthly = avgInterval >= 25 && avgInterval <= 35;
    const isYearly = avgInterval >= 360 && avgInterval <= 370;

    if (isMonthly || isYearly) {
      const lastTx = sorted[sorted.length - 1];
      const nextDate = new Date(lastTx.date);
      if (isMonthly) nextDate.setMonth(nextDate.getMonth() + 1);
      else nextDate.setFullYear(nextDate.getFullYear() + 1);

      subscriptions.push({
        id: lastTx.id,
        name: lastTx.description || lastTx.categories.name,
        amount: lastTx.total_amount,
        category: lastTx.categories.name,
        lastDate: lastTx.date,
        nextDate: nextDate.toISOString().split('T')[0],
        frequency: isMonthly ? 'monthly' : 'yearly',
        probability: 0.8 + (sorted.length > 3 ? 0.1 : 0) // Basic heuristic
      });
    }
  });

  return subscriptions;
};
