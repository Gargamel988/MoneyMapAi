import { GreenLoadingComponent as Loading } from '@/src/components/common/loading';
import { StackHeader } from '@/src/components/common/stack-header';
import { GoalCard } from '@/src/components/finance/goal-card';
import { useTheme } from '@/src/contexts/theme';
import { useGoals } from '@/src/hooks/useGoals';
import { useResponsive } from '@/src/hooks/useResponsive';
import { getUserExpenseCategories } from '@/src/lib/category';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert, FlatList, KeyboardAvoidingView, Modal,
  Platform, ScrollView, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BannerAd, BannerAdSize, TestIds } from '@/src/lib/adComponents';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : (process.env.EXPO_PUBLIC_BANNER_AD_UNIT_ID || TestIds.ADAPTIVE_BANNER);

interface Category {
  id: string;
  name: string;
  icon?: string;
}

export default function GoalsScreen() {
  const { theme } = useTheme();
  const { wp, hp, dimensions } = useResponsive();
  const { t, i18n } = useTranslation();
  const { goals, isLoading, createGoal, deleteGoal } = useGoals();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catPickerVisible, setCatPickerVisible] = useState(false);

  useEffect(() => {
    getUserExpenseCategories().then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
  }, []);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  // Stats
  const totalGoals = goals?.length ?? 0;
  const completedGoals = goals?.filter(g => (g.current_amount ?? 0) >= g.target_amount).length ?? 0;
  const totalSaved = goals?.reduce((s, g) => s + (g.current_amount ?? 0), 0) ?? 0;
  const totalTarget = goals?.reduce((s, g) => s + g.target_amount, 0) ?? 0;

  const resetForm = () => {
    setTitle('');
    setTargetAmount('');
    setDeadlineDate(undefined);
    setSelectedCategoryId(undefined);
  };

  const handleCreateGoal = async () => {
    if (!title.trim() || !targetAmount) {
      Alert.alert(t('common.error'), t('goals.error.fillAll'));
      return;
    }
    try {
      setSaving(true);
      await createGoal({
        title: title.trim(),
        target_amount: parseFloat(targetAmount.replace(/\./g, '')),
        category_id: selectedCategoryId ?? '',
        deadline: deadlineDate ? deadlineDate.toISOString().split('T')[0] : undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsModalVisible(false);
      resetForm();
    } catch {
      Alert.alert(t('common.error'), t('goals.error.createFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGoal = (id: string) => {
    Alert.alert(t('common.warning'), t('goals.confirmDelete'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          deleteGoal(id!);
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.headerbackground }}>
        <Stack.Screen options={{ headerShown: false }} />
        <StackHeader title={t('goals.title')} />
        <Loading />
      </View>
    );
  }

  const inputWrapStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.6),
    gap: wp(3),
    borderColor: theme.border,
    backgroundColor: theme.cardGlass,
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.headerbackground }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StackHeader
        title={t('goals.title')}
        rightElement={
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={{
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center'
            }}
          >
            <Feather name="plus" size={24} color={theme.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ padding: wp(4), paddingBottom: hp(12) }} showsVerticalScrollIndicator={false}>

        {/* ── Stats Summary Card ── */}
        {totalGoals > 0 && (
          <Animated.View
            entering={FadeInUp.duration(500)}
            style={{
              backgroundColor: theme.cardGlass,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: theme.cardBorder,
              padding: wp(5),
              marginBottom: hp(2.5),
              flexDirection: 'row',
            }}
          >
            <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: theme.primary }}>
                {totalGoals}
              </Text>
              <Text style={{ fontSize: 11, color: theme.textSecondary, fontWeight: '500' }}>{t('goals.stats.total')}</Text>
            </View>
            <View style={{ width: 1, backgroundColor: theme.border, marginVertical: hp(0.5) }} />
            <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: theme.success }}>
                {completedGoals}
              </Text>
              <Text style={{ fontSize: 11, color: theme.textSecondary, fontWeight: '500' }}>{t('goals.stats.completed')}</Text>
            </View>
            <View style={{ width: 1, backgroundColor: theme.border, marginVertical: hp(0.5) }} />
            <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: theme.warning }} numberOfLines={1}>
                {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
              </Text>
              <Text style={{ fontSize: 11, color: theme.textSecondary, fontWeight: '500' }}>{t('goals.stats.progress')}</Text>
            </View>
          </Animated.View>
        )}

        {/* ── Subtitle ── */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={{ fontSize: dimensions.fontSM, color: theme.textSecondary, marginBottom: hp(2), lineHeight: dimensions.fontSM * 1.5 }}>
            {t('goals.subtitle')}
          </Text>
        </Animated.View>

        {/* ── Goals List or Empty State ── */}
        {goals && goals.length > 0 ? (
          goals.map((goal, index) => (
            <Animated.View entering={FadeInDown.delay(index * 80).duration(400)} key={goal.id}>
              <GoalCard goal={goal} />
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: -hp(0.8), marginBottom: hp(1.5), gap: wp(1), paddingRight: wp(1) }}
                onPress={() => handleDeleteGoal(goal.id!)}
                activeOpacity={0.7}
              >
                <Feather name="trash-2" size={12} color={theme.error + '80'} />
                <Text style={{ fontSize: 11, fontWeight: '500', color: theme.error + '80' }}>
                  {t('common.delete')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))
        ) : (
          <Animated.View entering={FadeInDown.delay(200)} style={{ alignItems: 'center', marginTop: hp(10), gap: hp(2) }}>
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: theme.primary + '12', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="target-variant" size={52} color={theme.primary + '60'} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: theme.text }}>{t('goals.emptyTitle')}</Text>
            <Text style={{ fontSize: dimensions.fontSM, textAlign: 'center', maxWidth: '72%', lineHeight: dimensions.fontSM * 1.6, color: theme.textSecondary }}>
              {t('goals.empty')}
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(7), paddingVertical: hp(1.6), borderRadius: 50, gap: wp(2), marginTop: hp(1) }}
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.85}
            >
              <Feather name="plus" size={16} color="#FFF" />
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: dimensions.fontMD }}>{t('goals.createFirst')}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>

      {/* ══ Create Goal Bottom Sheet ══════════════════════ */}
      <Modal visible={isModalVisible} transparent animationType="slide" onRequestClose={() => { setIsModalVisible(false); resetForm(); }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => { setIsModalVisible(false); resetForm(); }} />
          <Animated.View entering={FadeInDown.duration(320)} style={{
            backgroundColor: theme.headerbackground,
            borderTopLeftRadius: 32, borderTopRightRadius: 32,
            borderWidth: 1, borderBottomWidth: 0, borderColor: theme.cardBorder,
            padding: wp(6), paddingBottom: hp(5), gap: hp(1.8),
          }}>
            {/* Handle */}
            <View style={{ width: wp(10), height: 4, borderRadius: 2, alignSelf: 'center', backgroundColor: theme.border, marginBottom: hp(0.5) }} />

            {/* Title row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: hp(0.5) }}>
              <Text style={{ fontSize: dimensions.fontXL ?? 22, fontWeight: '800', color: theme.text }}>🎯 {t('goals.modalTitle')}</Text>
              <TouchableOpacity onPress={() => { setIsModalVisible(false); resetForm(); }}>
                <View style={{ backgroundColor: theme.cardGlass, borderRadius: 20, padding: 6, borderWidth: 1, borderColor: theme.border }}>
                  <Feather name="x" size={16} color={theme.textSecondary} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Goal title */}
            <View style={inputWrapStyle}>
              <Feather name="flag" size={dimensions.iconSM} color={theme.primary} />
              <TextInput
                style={{ flex: 1, fontSize: dimensions.fontMD, padding: 0, color: theme.text }}
                placeholder={t('goals.namePlaceholder')}
                placeholderTextColor={theme.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Target amount */}
            <View style={inputWrapStyle}>
              <Feather name="crosshair" size={dimensions.iconSM} color={theme.warning} />
              <TextInput
                style={{ flex: 1, fontSize: dimensions.fontMD, padding: 0, color: theme.text }}
                placeholder={t('goals.amountPlaceholder')}
                placeholderTextColor={theme.textSecondary}
                value={targetAmount}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "");
                  const formatted = cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  if (formatted.length > 13) return;
                  setTargetAmount(formatted);
                }}
                keyboardType="numeric"
              />
            </View>

            {/* Category picker */}
            <TouchableOpacity style={inputWrapStyle} onPress={() => setCatPickerVisible(true)} activeOpacity={0.8}>
              <Feather name="tag" size={dimensions.iconSM} color={theme.success} />
              <Text style={{ flex: 1, fontSize: dimensions.fontMD, color: selectedCategoryId ? theme.text : theme.textSecondary }}>
                {selectedCategory?.name ?? t('goals.categoryPlaceholder')}
              </Text>
              <Feather name="chevron-right" size={dimensions.iconSM} color={theme.textSecondary} />
            </TouchableOpacity>

            {/* Deadline */}
            <TouchableOpacity style={inputWrapStyle} onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
              <Feather name="calendar" size={dimensions.iconSM} color={theme.error} />
              <Text style={{ flex: 1, fontSize: dimensions.fontMD, color: deadlineDate ? theme.text : theme.textSecondary }}>
                {deadlineDate
                  ? deadlineDate.toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                  : t('goals.datePlaceholder')}
              </Text>
              {deadlineDate && (
                <TouchableOpacity onPress={() => setDeadlineDate(undefined)}>
                  <Feather name="x-circle" size={dimensions.iconSM} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={deadlineDate ?? new Date()}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(_, selected) => {
                  setDeadlineDate(selected);
                  setShowDatePicker(false);
                }}
              />
            )}

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', gap: wp(3), marginTop: hp(0.5) }}>
              <TouchableOpacity
                style={{ flex: 1, height: hp(6.5), borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.cardGlass, borderWidth: 1, borderColor: theme.border }}
                onPress={() => { setIsModalVisible(false); resetForm(); }}
              >
                <Text style={{ fontWeight: '600', fontSize: dimensions.fontMD, color: theme.textSecondary }}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 2, height: hp(6.5), borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: saving ? theme.primary + '80' : theme.primary, flexDirection: 'row', gap: wp(2) }}
                onPress={handleCreateGoal}
                disabled={saving}
                activeOpacity={0.85}
              >
                <Feather name={saving ? 'loader' : 'check'} size={16} color="#FFF" />
                <Text style={{ fontWeight: '700', fontSize: dimensions.fontMD, color: '#FFF' }}>
                  {saving ? t('goals.saving') : t('goals.save')}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══ Category Picker Bottom Sheet ════════════════ */}
      <Modal visible={catPickerVisible} transparent animationType="slide" onRequestClose={() => setCatPickerVisible(false)}>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} activeOpacity={1} onPress={() => setCatPickerVisible(false)}>
          <Animated.View entering={FadeInDown.duration(260)} style={{
            backgroundColor: theme.headerbackground,
            borderTopLeftRadius: 32, borderTopRightRadius: 32,
            borderWidth: 1, borderBottomWidth: 0, borderColor: theme.cardBorder,
            padding: wp(5), paddingBottom: hp(5), gap: hp(1),
          }}>
            <View style={{ width: wp(10), height: 4, borderRadius: 2, alignSelf: 'center', backgroundColor: theme.border, marginBottom: hp(1) }} />
            <Text style={{ fontSize: 20, fontWeight: '800', color: theme.text, marginBottom: hp(0.5) }}>
              {t('goals.categoryPlaceholder')}
            </Text>

            {/* No category */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(3), paddingVertical: hp(1.4), borderRadius: 14, gap: wp(3), backgroundColor: selectedCategoryId == null ? theme.primary + '15' : 'transparent' }}
              onPress={() => { setSelectedCategoryId(undefined); setCatPickerVisible(false); }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: theme.border + '40', alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="slash" size={16} color={theme.textSecondary} />
              </View>
              <Text style={{ flex: 1, fontSize: dimensions.fontMD, fontWeight: '500', color: selectedCategoryId == null ? theme.primary : theme.text }}>
                {t('pieChart.unknownCategory')}
              </Text>
              {selectedCategoryId == null && <Feather name="check-circle" size={18} color={theme.primary} />}
            </TouchableOpacity>

            <FlatList
              data={categories}
              keyExtractor={c => c.id}
              renderItem={({ item }) => {
                const isSelected = selectedCategoryId === item.id;
                return (
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(3), paddingVertical: hp(1.4), borderRadius: 14, gap: wp(3), backgroundColor: isSelected ? theme.primary + '15' : 'transparent', marginBottom: hp(0.3) }}
                    onPress={() => { setSelectedCategoryId(item.id); setCatPickerVisible(false); }}
                  >
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isSelected ? theme.primary + '20' : theme.cardGlass, borderWidth: 1, borderColor: isSelected ? theme.primary + '40' : theme.border, alignItems: 'center', justifyContent: 'center' }}>
                      <Feather name={(item.icon as any) || 'tag'} size={16} color={isSelected ? theme.primary : theme.textSecondary} />
                    </View>
                    <Text style={{ flex: 1, fontSize: dimensions.fontMD, fontWeight: isSelected ? '700' : '500', color: isSelected ? theme.primary : theme.text }}>
                      {item.name}
                    </Text>
                    {isSelected && <Feather name="check-circle" size={18} color={theme.primary} />}
                  </TouchableOpacity>
                );
              }}
              style={{ maxHeight: hp(45) }}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
