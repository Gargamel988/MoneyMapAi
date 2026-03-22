export const QUERY_KEYS = {
  transactions: {
    all: ['transactions'] as const,
    list: () => [...QUERY_KEYS.transactions.all, 'list'] as const,
    byPeriod: (period: string) => [...QUERY_KEYS.transactions.list(), period] as const,
    lastProcess: () => [...QUERY_KEYS.transactions.list(), 'last-process'] as const,
    stats: () => [...QUERY_KEYS.transactions.all, 'stats'] as const,
    pieChart: () => [...QUERY_KEYS.transactions.stats(), 'pie-chart'] as const,
    analytics: () => [...QUERY_KEYS.transactions.stats(), 'analytics'] as const,
  },
  categories: {
    all: ['categories'] as const,
    income: () => [...QUERY_KEYS.categories.all, 'income'] as const,
    expense: () => [...QUERY_KEYS.categories.all, 'expense'] as const,
  },
  user: {
    all: ['user'] as const,
    profile: () => [...QUERY_KEYS.user.all, 'profile'] as const,
    settings: () => [...QUERY_KEYS.user.all, 'settings'] as const,
    currency: () => [...QUERY_KEYS.user.settings(), 'currency'] as const,
    language: () => [...QUERY_KEYS.user.settings(), 'language'] as const,
    theme: () => [...QUERY_KEYS.user.settings(), 'theme'] as const,
  },
  ai: {
    all: ['ai'] as const,
    advisor: () => [...QUERY_KEYS.ai.all, 'advisor'] as const,
  }
} as const;
