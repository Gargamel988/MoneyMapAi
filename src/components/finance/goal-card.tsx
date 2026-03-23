import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring, withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../contexts/theme';
import { useResponsive } from '../../hooks/useResponsive';
import { useGoals } from '../../hooks/useGoals';
import { BudgetGoal } from '../../lib/goals';

interface GoalCardProps {
  goal: BudgetGoal;
}

// Animated SVG circle for progress ring
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { wp, hp, dimensions } = useResponsive();
  const { updateGoalAmount, isUpdating } = useGoals();

  const [inputVisible, setInputVisible] = useState(false);
  const [contribution, setContribution] = useState('');

  const rawProgress = goal.target_amount > 0
    ? Math.min((goal.current_amount ?? 0) / goal.target_amount, 1)
    : 0;
  const percentage = Math.round(rawProgress * 100);
  const isCompleted = percentage >= 100;

  // Circular progress ring
  const RING_SIZE = 72;
  const STROKE = 7;
  const RADIUS = (RING_SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const progressAnim = useSharedValue(0);
  useEffect(() => {
    progressAnim.value = withTiming(rawProgress, { duration: 900 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progressAnim.value),
  }));

  // Scale animation on card mount
  const scale = useSharedValue(0.95);
  useEffect(() => { scale.value = withSpring(1, { damping: 14 }); }, []);
  const cardAnim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Color based on progress
  const progressColor = isCompleted
    ? theme.success
    : percentage >= 60 ? theme.primary
    : percentage >= 30 ? theme.warning
    : theme.error;

  const remaining = Math.max(0, goal.target_amount - (goal.current_amount ?? 0));

  const handleContribute = async (isWithdraw = false) => {
    const amount = parseFloat(contribution);
    if (!contribution || isNaN(amount) || amount <= 0) {
      Alert.alert(t('goalCard.alert.error'), t('goalCard.alert.invalidAmount'));
      return;
    }
    try {
      await updateGoalAmount(goal.id!, isWithdraw ? -amount : amount);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setContribution('');
      setInputVisible(false);
    } catch {
      Alert.alert(t('goalCard.alert.error'), t('goalCard.alert.updateError'));
    }
  };

  return (
    <Animated.View style={[{
      backgroundColor: theme.cardGlass,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: isCompleted ? progressColor + '50' : theme.cardBorder,
      marginBottom: hp(1.5),
      overflow: 'hidden',
    }, cardAnim]}>

      {/* Colored top accent bar */}
      <View style={{ height: 4, backgroundColor: progressColor, opacity: 0.7 }} />

      <View style={{ padding: wp(4), gap: hp(1.5) }}>
        {/* Main row: progress ring + info */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(4) }}>
          {/* Circular progress ring */}
          <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: 'absolute' }}>
              {/* Track */}
              <Circle
                cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
                stroke={theme.border + '60'}
                strokeWidth={STROKE}
                fill="none"
              />
              {/* Fill */}
              <AnimatedCircle
                cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
                stroke={progressColor}
                strokeWidth={STROKE}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeLinecap="round"
                rotation="-90"
                origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
                animatedProps={animatedProps}
              />
            </Svg>
            {/* Center text */}
            <Text style={{ fontSize: 13, fontWeight: '800', color: progressColor }}>
              {isCompleted ? '🎉' : `${percentage}%`}
            </Text>
          </View>

          {/* Title + amounts */}
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontSize: dimensions.fontMD, fontWeight: '700', color: theme.text }} numberOfLines={2}>
              {goal.title}
            </Text>
            {goal.deadline && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="calendar" size={11} color={theme.textSecondary} />
                <Text style={{ fontSize: 11, color: theme.textSecondary, fontWeight: '500' }}>
                  {new Date(goal.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            )}

            {/* Amount row */}
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: progressColor }}>
                {(goal.current_amount ?? 0).toLocaleString()}
              </Text>
              <Text style={{ fontSize: 13, color: theme.textSecondary, fontWeight: '500' }}>
                / {goal.target_amount.toLocaleString()} {t('common.currencySymbol')}
              </Text>
            </View>

            {/* Remaining badge */}
            {!isCompleted && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ backgroundColor: progressColor + '18', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 10, color: progressColor, fontWeight: '700' }}>
                    {t('goalCard.remaining', { amount: remaining.toLocaleString() })}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Contribution section */}
        {inputVisible ? (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: wp(2),
            backgroundColor: theme.background, borderRadius: 14,
            borderWidth: 1, borderColor: theme.border,
            paddingHorizontal: wp(3), paddingVertical: hp(1),
          }}>
            <Feather name="trending-up" size={14} color={theme.textSecondary} />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: theme.text, padding: 0 }}
              placeholder={t('goalCard.placeholder.amount')}
              placeholderTextColor={theme.textSecondary}
              value={contribution}
              onChangeText={setContribution}
              keyboardType="numeric"
              autoFocus
            />
            <TouchableOpacity
              style={{ backgroundColor: theme.success + '20', paddingHorizontal: wp(3), paddingVertical: hp(0.6), borderRadius: 10 }}
              onPress={() => handleContribute(false)} disabled={isUpdating}
            >
              <Text style={{ color: theme.success, fontWeight: '700', fontSize: 12 }}>{t('goalCard.button.add')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: theme.error + '20', paddingHorizontal: wp(3), paddingVertical: hp(0.6), borderRadius: 10 }}
              onPress={() => handleContribute(true)} disabled={isUpdating}
            >
              <Text style={{ color: theme.error, fontWeight: '700', fontSize: 12 }}>{t('goalCard.button.subtract')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setInputVisible(false); setContribution(''); }}>
              <Feather name="x" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              paddingVertical: hp(1.2), borderRadius: 14, gap: wp(2),
              backgroundColor: isCompleted ? theme.success + '15' : progressColor + '12',
              borderWidth: 1,
              borderColor: isCompleted ? theme.success + '40' : progressColor + '30',
            }}
            onPress={() => setInputVisible(true)}
            activeOpacity={0.8}
          >
            <Feather
              name={isCompleted ? 'check-circle' : 'plus-circle'}
              size={15}
              color={isCompleted ? theme.success : progressColor}
            />
            <Text style={{ fontSize: 13, fontWeight: '700', color: isCompleted ? theme.success : progressColor }}>
              {isCompleted ? t('goalCard.status.completed') : t('goalCard.button.update')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};
