import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/src/contexts/theme';
import { useResponsive } from '@/src/hooks/useResponsive';
import { Transaction, TransactionList } from '@/src/types/transactionTypes';
import { hexToRgba } from '@/src/utils/hextorgba';

interface MonthlyComparisonProps {
  data: TransactionList;
  currency: string;
}

export const MonthlyComparison: React.FC<MonthlyComparisonProps> = ({ data, currency }) => {
  const { theme } = useTheme();
  const { wp, hp } = useResponsive();
  const { t } = useTranslation();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthExpenses = data
    .filter((item: Transaction) => {
      const d = new Date(item.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && item.type === 'gider';
    })
    .reduce((acc, item) => acc + (item.total_amount || 0), 0);

  const lastMonthExpenses = data
    .filter((item: Transaction) => {
      const d = new Date(item.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear && item.type === 'gider';
    })
    .reduce((acc, item) => acc + (item.total_amount || 0), 0);

  if (lastMonthExpenses === 0 && currentMonthExpenses === 0) return null;

  const diff = currentMonthExpenses - lastMonthExpenses;
  const absDiff = Math.abs(diff);
  const percentChange = lastMonthExpenses > 0
    ? Math.abs((diff / lastMonthExpenses) * 100).toFixed(1)
    : '0';

  const isIncrease = diff > 0;
  const trendColor = isIncrease ? theme.error : theme.success;
  const trendBg = isIncrease ? hexToRgba(theme.error, 0.12) : hexToRgba(theme.success, 0.12);

  const insightText = isIncrease
    ? t('analytics.comparison.insightIncrease', { percent: percentChange })
    : t('analytics.comparison.insightDecrease', { percent: percentChange });

  return (
    <Animated.View entering={FadeInDown.duration(500)} style={{ marginHorizontal: wp(4), marginVertical: hp(1) }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: hp(1) }}>
        {t('analytics.comparison.title')}
      </Text>

      {/* Main comparison card */}
      <View style={{
        backgroundColor: isIncrease ? hexToRgba(theme.error, 0.05) : hexToRgba(theme.success, 0.05),
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: isIncrease ? hexToRgba(theme.error, 0.3) : hexToRgba(theme.success, 0.3),
        padding: wp(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '500' }}>
            {t('analytics.comparison.vsLastMonth')}
          </Text>
          <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800' }}>
            {isIncrease ? '+' : '-'}{currency} {absDiff.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Trend badge */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: trendBg,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
        }}>
          <Feather
            name={isIncrease ? 'trending-up' : 'trending-down'}
            size={18}
            color={trendColor}
          />
          <Text style={{ color: trendColor, fontWeight: '700', fontSize: 14 }}>
            {isIncrease ? '+' : '-'}{percentChange}%
          </Text>
        </View>
      </View>

      {/* Insight row */}
      <View style={{
        marginTop: hp(1),
        backgroundColor: isIncrease ? hexToRgba(theme.error, 0.08) : hexToRgba(theme.success, 0.08),
        borderRadius: 14,
        borderWidth: 1,
        borderColor: isIncrease ? hexToRgba(theme.error, 0.2) : hexToRgba(theme.success, 0.2),
        padding: wp(3),
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
      }}>
        <Text style={{ fontSize: 16 }}>{isIncrease ? '⚠️' : '🎉'}</Text>
        <Text style={{ flex: 1, color: theme.textSecondary, fontSize: 13, lineHeight: 19 }}>
          {insightText}
        </Text>
      </View>
    </Animated.View>
  );
};
