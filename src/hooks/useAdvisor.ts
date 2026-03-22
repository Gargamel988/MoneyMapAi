import { useQuery } from '@tanstack/react-query';
import { aiAdvisorApi } from '../lib/ai-advisor';
import { QUERY_KEYS } from '../constants/queryKeys';
import { useTranslation } from 'react-i18next';

export const useAdvisor = () => {
  const { i18n } = useTranslation();
  const currentLanguage = (i18n.language || 'en').split('-')[0];

  return useQuery({
    queryKey: QUERY_KEYS.ai.advisor(),
    queryFn: () => aiAdvisorApi.getAdvice(currentLanguage),
    staleTime: 1000 * 60 * 60, // Advice is stable for 1 hour
    retry: 1,
    enabled: true, // We can condition this on user login if needed
  });
};
