import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/src/contexts/theme';
import { useResponsive } from '@/src/hooks/useResponsive';
import { QUERY_KEYS } from '@/src/constants/queryKeys';
import { transactionsApi } from '@/src/lib/transactions';
import { detectSubscriptions, Subscription } from '@/src/lib/subscription-detector';
import { GreenLoadingComponent as Loading } from '@/src/components/common/loading';
import { StackHeader } from '@/src/components/common/stack-header';

export default function SubscriptionsScreen() {
  const { theme } = useTheme();
  const { wp, hp, dimensions } = useResponsive();
  const { t } = useTranslation();
  const router = useRouter();

  const { data: allTransactions, isLoading } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: () => transactionsApi.getAllTransactions(),
  });

  const subscriptions = useMemo(() => {
    if (!allTransactions) return [];
    return detectSubscriptions(allTransactions);
  }, [allTransactions]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.headerbackground }}>
        <Stack.Screen options={{ headerShown: false }} />
        <StackHeader title={t('subscriptions.title', { defaultValue: 'Subscriptions' })} />
        <Loading />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.headerbackground }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StackHeader title={t('subscriptions.title', { defaultValue: 'Subscriptions' })} />
      
      <ScrollView contentContainerStyle={{ padding: wp(4) }}>
        <View style={{ marginBottom: hp(2) }}>
          <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20 }}>
            {t('subscriptions.description', { 
              defaultValue: 'We automatically detected these recurring payments from your history.' 
            })}
          </Text>
        </View>

        {subscriptions.map((sub) => (
          <View 
            key={sub.id}
            style={{
              backgroundColor: theme.headerbackground,
              borderRadius: 16,
              padding: wp(4),
              marginBottom: hp(1.5),
              borderWidth: 1,
              borderColor: theme.border,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <View style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 12, 
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: wp(3)
            }}>
              <MaterialCommunityIcons name="calendar-sync" size={24} color={theme.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                {sub.name}
              </Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                Next: {sub.nextDate} • {sub.frequency === 'monthly' ? t('common.monthly') : t('common.yearly')}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                {sub.amount.toLocaleString()} ₺
              </Text>
              <View style={{ 
                backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                paddingHorizontal: 6, 
                paddingVertical: 2, 
                borderRadius: 4,
                marginTop: 4
              }}>
                <Text style={{ fontSize: 10, color: '#10b981', fontWeight: '600' }}>
                  {Math.round(sub.probability * 100)}% Match
                </Text>
              </View>
            </View>
          </View>
        ))}

        {subscriptions.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: hp(10) }}>
            <MaterialCommunityIcons name="playlist-remove" size={64} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary, marginTop: hp(2), textAlign: 'center' }}>
              {t('subscriptions.empty', { defaultValue: 'No recurring payments detected yet.' })}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
