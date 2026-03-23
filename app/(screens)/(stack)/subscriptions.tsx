import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/src/contexts/theme';
import { useResponsive } from '@/src/hooks/useResponsive';
import { QUERY_KEYS } from '@/src/constants/queryKeys';
import { transactionsApi } from '@/src/lib/transactions';
import { detectSubscriptions, Subscription } from '@/src/lib/subscription-detector';
import { subscriptionsApi, SavedSubscription } from '@/src/lib/subscriptions';
import { GreenLoadingComponent as Loading } from '@/src/components/common/loading';
import { StackHeader } from '@/src/components/common/stack-header';

const SUBSCRIPTIONS_QUERY_KEY = ['subscriptions'];

export default function SubscriptionsScreen() {
  const { theme } = useTheme();
  const { wp, hp } = useResponsive();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newFrequency, setNewFrequency] = useState<'monthly' | 'yearly'>('monthly');

  // Fetch all transactions for auto-detection
  const { data: allTransactions, isLoading: txLoading } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: () => transactionsApi.getAllTransactions(),
  });

  // Fetch saved subscriptions from Supabase
  const { data: savedSubscriptions = [], isLoading: subLoading } = useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEY,
    queryFn: subscriptionsApi.getAll,
  });

  const detectedSubscriptions = useMemo(() => {
    if (!allTransactions) return [];
    return detectSubscriptions(allTransactions);
  }, [allTransactions]);

  // IDs of already saved subscriptions (by name+amount key)
  const savedKeys = useMemo(() => {
    return new Set(savedSubscriptions.map(s => `${s.name}_${s.amount}`));
  }, [savedSubscriptions]);

  // Save detected subscription to Supabase
  const saveMutation = useMutation({
    mutationFn: (sub: Subscription) =>
      subscriptionsApi.save({
        name: sub.name,
        amount: sub.amount,
        category: sub.category,
        frequency: sub.frequency,
        next_date: sub.nextDate,
        last_date: sub.lastDate,
        is_active: true,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY }),
  });

  // Toggle active/passive
  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      subscriptionsApi.toggle(id, is_active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY }),
  });

  // Delete subscription
  const deleteMutation = useMutation({
    mutationFn: (id: string) => subscriptionsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY }),
  });

  // Add manual subscription
  const addMutation = useMutation({
    mutationFn: () => {
      const today = new Date();
      const nextDate = new Date(today);
      if (newFrequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
      else nextDate.setFullYear(nextDate.getFullYear() + 1);
      return subscriptionsApi.save({
        name: newName.trim(),
        amount: parseFloat(newAmount),
        category: 'Manuel',
        frequency: newFrequency,
        next_date: nextDate.toISOString().split('T')[0],
        last_date: today.toISOString().split('T')[0],
        is_active: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
      setShowAddModal(false);
      setNewName('');
      setNewAmount('');
      setNewFrequency('monthly');
    },
  });

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      t('subscriptions.deleteTitle'),
      t('subscriptions.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => deleteMutation.mutate(id) },
      ]
    );
  }, [deleteMutation, t]);

  const isLoading = txLoading || subLoading;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.headerbackground }}>
        <Stack.Screen options={{ headerShown: false }} />
        <StackHeader title={t('subscriptions.title')} />
        <Loading />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.headerbackground }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StackHeader title={t('subscriptions.title')} />

      <ScrollView contentContainerStyle={{ padding: wp(4) }}>

        {/* Auto-detected Section */}
        {detectedSubscriptions.length > 0 && (
          <View style={{ marginBottom: hp(2) }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, marginBottom: hp(1), textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('subscriptions.detected')}
            </Text>
            {detectedSubscriptions.map((sub) => {
              const key = `${sub.name}_${sub.amount}`;
              const alreadySaved = savedKeys.has(key);
              return (
                <View
                  key={sub.id}
                  style={{
                    backgroundColor: theme.headerbackground,
                    borderRadius: 16,
                    padding: wp(4),
                    marginBottom: hp(1.5),
                    borderWidth: 1,
                    borderColor: alreadySaved ? theme.primary + '44' : theme.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    alignItems: 'center', justifyContent: 'center', marginRight: wp(3)
                  }}>
                    <MaterialCommunityIcons name="calendar-sync" size={22} color={theme.primary} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.text }}>{sub.name}</Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                      {sub.frequency === 'monthly'
                        ? t('common.monthly', { defaultValue: 'Aylık' })
                        : t('common.yearly', { defaultValue: 'Yıllık' })}
                      {' • '}{sub.nextDate}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.text }}>
                      {sub.amount.toLocaleString()} ₺
                    </Text>
                    {alreadySaved ? (
                      <View style={{ backgroundColor: 'rgba(16,185,129,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                        <Text style={{ fontSize: 11, color: '#10b981', fontWeight: '600' }}>✓ {t('subscriptions.status.saved')}</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => saveMutation.mutate(sub)}
                        disabled={saveMutation.isPending}
                        style={{ backgroundColor: theme.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}
                      >
                        {saveMutation.isPending
                          ? <ActivityIndicator size="small" color="#fff" />
                          : <Text style={{ fontSize: 12, color: '#fff', fontWeight: '600' }}>{t('common.save')}</Text>}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Saved Subscriptions Section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: hp(1) }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {t('subscriptions.saved')}
          </Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <MaterialCommunityIcons name="plus-circle" size={18} color={theme.primary} />
            <Text style={{ fontSize: 13, color: theme.primary, fontWeight: '600' }}>{t('common.add')}</Text>
          </TouchableOpacity>
        </View>

        {savedSubscriptions.length === 0 ? (
          <View style={{ alignItems: 'center', padding: hp(4) }}>
            <MaterialCommunityIcons name="playlist-remove" size={56} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary, marginTop: hp(1.5), textAlign: 'center' }}>
              {t('subscriptions.empty')}
            </Text>
          </View>
        ) : (
          savedSubscriptions.map((sub) => (
            <View
              key={sub.id}
              style={{
                backgroundColor: theme.headerbackground,
                borderRadius: 16,
                padding: wp(4),
                marginBottom: hp(1.5),
                borderWidth: 1,
                borderColor: theme.border,
                opacity: sub.is_active ? 1 : 0.6,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 44, height: 44, borderRadius: 12,
                  backgroundColor: sub.is_active ? 'rgba(99, 102, 241, 0.12)' : 'rgba(150,150,150,0.1)',
                  alignItems: 'center', justifyContent: 'center', marginRight: wp(3)
                }}>
                  <MaterialCommunityIcons
                    name={sub.is_active ? 'calendar-check' : 'calendar-remove'}
                    size={22}
                    color={sub.is_active ? theme.primary : theme.textSecondary}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.text }}>{sub.name}</Text>
                  <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                    {sub.frequency === 'monthly'
                      ? t('common.monthly')
                      : t('common.yearly')}
                    {' • '}{t('subscriptions.labels.next')}: {sub.next_date}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: theme.text }}>
                    {Number(sub.amount).toLocaleString()} ₺
                  </Text>
                  <Switch
                    value={sub.is_active}
                    onValueChange={(val) => toggleMutation.mutate({ id: sub.id, is_active: val })}
                    thumbColor={sub.is_active ? theme.primary : '#ccc'}
                    trackColor={{ false: '#ddd', true: theme.primary + '55' }}
                  />
                </View>
              </View>

              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => handleDelete(sub.id)}
                style={{ alignSelf: 'flex-end', marginTop: hp(1), flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={16} color="#ef4444" />
                <Text style={{ fontSize: 12, color: '#ef4444' }}>{t('common.delete')}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Manual Subscription Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: theme.headerbackground, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: wp(6), paddingBottom: hp(5) }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: hp(3) }}>{t('subscriptions.addTitle')}</Text>

            <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 6 }}>{t('subscriptions.labels.name')}</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder={t('subscriptions.placeholders.name')}
              placeholderTextColor={theme.textSecondary}
              style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 10, padding: wp(3), color: theme.text, marginBottom: hp(2) }}
            />

            <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 6 }}>{t('subscriptions.labels.amount')} (₺)</Text>
            <TextInput
              value={newAmount}
              onChangeText={setNewAmount}
              placeholder={t('subscriptions.placeholders.amount')}
              keyboardType="numeric"
              placeholderTextColor={theme.textSecondary}
              style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 10, padding: wp(3), color: theme.text, marginBottom: hp(2) }}
            />

            <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 8 }}>{t('subscriptions.labels.frequency')}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: hp(3) }}>
              {(['monthly', 'yearly'] as const).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  onPress={() => setNewFrequency(freq)}
                  style={{
                    flex: 1, padding: wp(3), borderRadius: 10, borderWidth: 1.5,
                    borderColor: newFrequency === freq ? theme.primary : theme.border,
                    backgroundColor: newFrequency === freq ? theme.primary + '15' : 'transparent',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: newFrequency === freq ? theme.primary : theme.textSecondary, fontWeight: '600' }}>
                    {freq === 'monthly' ? t('common.monthly') : t('common.yearly')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={{ flex: 1, padding: wp(4), borderRadius: 12, borderWidth: 1, borderColor: theme.border, alignItems: 'center' }}
              >
                <Text style={{ color: theme.textSecondary, fontWeight: '600' }}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addMutation.mutate()}
                disabled={!newName.trim() || !newAmount || addMutation.isPending}
                style={{
                  flex: 1, padding: wp(4), borderRadius: 12,
                  backgroundColor: (!newName.trim() || !newAmount) ? theme.primary + '55' : theme.primary,
                  alignItems: 'center',
                }}
              >
                {addMutation.isPending
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={{ color: '#fff', fontWeight: '700' }}>{t('common.save')}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
