import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../lib/transactions';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useTransactions = () => {
  const getTransactionsByMonth = () => {
    return useQuery({
      queryKey: QUERY_KEYS.transactions.byPeriod('month'),
      queryFn: transactionsApi.getTransactionsByMonth,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  const getRecentTransactions = () => {
    return useQuery({
      queryKey: QUERY_KEYS.transactions.lastProcess(),
      queryFn: transactionsApi.getRecentTransactions,
      staleTime: 1000 * 60 * 2, // 2 minutes
    });
  };

  return {
    getTransactionsByMonth,
    getRecentTransactions,
  };
};
