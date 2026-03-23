import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/theme';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import { useTransactions } from '@/src/hooks/useTransactions';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { advisorScheme } from '@/src/schemas/advisorScheme';
import { generateAPIUrl } from '@/src/utils/utils';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { StackHeader } from '@/src/components/common/stack-header';

export default function AIAdvisorScreen() {
  const { theme } = useTheme();
  const { dimensions, wp, hp } = useResponsive();
  const { t, i18n } = useTranslation();
  const { getTransactionsByMonth } = useTransactions();
  const { data: transactions, isLoading: isDataLoading, error: dataError, refetch } = getTransactionsByMonth();

  const { object: advice, submit, isLoading: isAiGenerating, error: aiError } = useObject({
    api: generateAPIUrl('/api/advisor'),
    schema: advisorScheme,
    fetch: expoFetch as unknown as typeof globalThis.fetch,
  });

  useEffect(() => {
    if (transactions && transactions.length > 0 && !advice && !isAiGenerating) {
      const stats = {
        totalIncome: transactions.filter(t => t.type === 'gelir').reduce((sum, t) => sum + (t.amount || 0), 0),
        totalExpense: transactions.filter(t => t.type === 'gider').reduce((sum, t) => sum + (t.amount || 0), 0),
      };

      submit({
        transactions,
        language: i18n.language,
        stats
      });
    }
  }, [transactions, i18n.language]);

  const handleRetry = () => {
    if (dataError) refetch();
    else if (transactions) {
       const stats = {
        totalIncome: transactions.filter(t => t.type === 'gelir').reduce((sum, t) => sum + (t.amount || 0), 0),
        totalExpense: transactions.filter(t => t.type === 'gider').reduce((sum, t) => sum + (t.amount || 0), 0),
      };
      submit({ transactions, language: i18n.language, stats });
    }
  };

  const renderHealthScore = (score: number) => {
    let color = theme.success;
    if (score < 40) color = theme.error;
    else if (score < 70) color = theme.warning;

    return (
      <Animated.View entering={FadeInUp.delay(200)} style={[styles.scoreCard, { backgroundColor: theme.cardGlass, borderColor: theme.cardBorder }]}>
        <View style={styles.scoreContent}>
          <View style={styles.scoreTextContainer}>
            <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>{t('advisor.healthScore')}</Text>
            <Text style={[styles.scoreValue, { color }]}>{score}/100</Text>
          </View>
          <MaterialCommunityIcons name="heart-pulse" size={48} color={color} />
        </View>
      </Animated.View>
    );
  };

  if (isDataLoading || (isAiGenerating && !advice)) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.headerbackground }}>
        <Stack.Screen options={{ headerShown: false }} />
        <StackHeader title={t('advisor.title')} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            {isDataLoading ? t('common.loading') : t('advisor.analyzing')}
          </Text>
        </View>
      </View>
    );
  }

  const error = dataError || aiError;
  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.headerbackground }}>
        <Stack.Screen options={{ headerShown: false }} />
        <StackHeader title={t('advisor.title')} />
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={64} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.textSecondary }]}>{error.toString()}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={handleRetry}>
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.headerbackground }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StackHeader title={t('advisor.title')} />
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        {advice && (
          <>
            {advice.financialHealthScore !== undefined && renderHealthScore(advice.financialHealthScore)}
            {advice.summary && (
              <Animated.View entering={FadeInUp.delay(400)} style={[styles.section, { backgroundColor: theme.cardGlass, borderColor: theme.cardBorder }]}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="text-box-search-outline" size={24} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('advisor.summary')}</Text>
                </View>
                <Text style={[styles.summaryText, { color: theme.textSecondary }]}>{advice.summary}</Text>
              </Animated.View>
            )}

            <View style={styles.row}>
              {advice.insights && advice.insights.length > 0 && (
                <Animated.View entering={FadeInRight.delay(600)} style={[styles.section, styles.halfSection, { backgroundColor: theme.cardGlass, borderColor: theme.cardBorder }]}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="bulb-outline" size={24} color={theme.warning} />
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('advisor.insights')}</Text>
                  </View>
                  {advice.insights.filter((i): i is string => !!i).map((insight: string, index: number) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
                      <Text style={[styles.itemText, { color: theme.textSecondary }]}>{insight}</Text>
                    </View>
                  ))}
                </Animated.View>
              )}

              {advice.recommendations && advice.recommendations.length > 0 && (
                <Animated.View entering={FadeInRight.delay(800)} style={[styles.section, styles.halfSection, { backgroundColor: theme.cardGlass, borderColor: theme.cardBorder }]}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="checkmark-done-outline" size={24} color={theme.success} />
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('advisor.recommendations')}</Text>
                  </View>
                  {advice.recommendations.filter((r): r is string => !!r).map((rec: string, index: number) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
                      <Text style={[styles.itemText, { color: theme.textSecondary }]}>{rec}</Text>
                    </View>
                  ))}
                </Animated.View>
              )}
            </View>

            {advice.warningCategories && advice.warningCategories.length > 0 && (
              <Animated.View entering={FadeInUp.delay(1000)} style={[styles.section, { backgroundColor: 'rgba(255, 59, 48, 0.1)', borderColor: 'rgba(255, 59, 48, 0.2)' }]}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="warning-outline" size={24} color={theme.error} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('advisor.warnings')}</Text>
                </View>
                {advice.warningCategories.filter((w): w is any => !!w).map((warn: any, index: number) => (
                  <View key={index} style={styles.warningItem}>
                    <Text style={[styles.warningCategory, { color: theme.text }]}>{warn.category}</Text>
                    <Text style={[styles.warningReason, { color: theme.textSecondary }]}>{warn.reason}</Text>
                    {warn.percentageIncrease && (
                      <Text style={[styles.warningPercentage, { color: theme.error }]}>+{warn.percentageIncrease}%</Text>
                    )}
                  </View>
                ))}
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '600',
  },
  scoreCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  scoreContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreTextContainer: {
    gap: 4,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  section: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'column',
    gap: 16,
  },
  halfSection: {
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  warningItem: {
    marginBottom: 12,
    gap: 2,
  },
  warningCategory: {
    fontSize: 16,
    fontWeight: '700',
  },
  warningReason: {
    fontSize: 14,
  },
  warningPercentage: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
});
