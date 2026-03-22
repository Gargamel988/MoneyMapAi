export const APP_CONFIG = {
  currencies: {
    TRY: { symbol: '₺', label: 'TRY' },
    USD: { symbol: '$', label: 'USD' },
    EUR: { symbol: '€', label: 'EUR' },
    GBP: { symbol: '£', label: 'GBP' },
    JPY: { symbol: '¥', label: 'JPY' },
    CNY: { symbol: '¥', label: 'CNY' },
  },
  defaultCurrency: 'TRY',
  defaultLanguage: 'tr',
  languages: ['tr', 'en', 'de'],
} as const;

export type CurrencyCode = keyof typeof APP_CONFIG.currencies;

export const getCurrencySymbol = (code: string): string => {
  return APP_CONFIG.currencies[code as CurrencyCode]?.symbol || code;
};
