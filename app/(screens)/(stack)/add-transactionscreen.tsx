'use client';
import { useResponsive } from '@/src/hooks/useRespons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ExpenseEntry } from '../../../src/components/transaction/expens';
import { IncomeEntry } from '../../../src/components/transaction/income';
import { useTheme } from '../../../src/contexts/theme';

const AddTransaction: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'expense' | 'income'>('expense');
  const { dimensions, wp } = useResponsive();
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        padding: wp(4),
      }}
    >
      {/* === Geri Butonu === */}


      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: '100%',
            maxWidth: 600,
            alignSelf: 'center',
          }}
        >
          {/* === Başlık ve Geri Butonu === */}
          <View
            style={{
              marginVertical: dimensions.lg,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: dimensions.md,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                paddingVertical: dimensions.sm,
                paddingHorizontal: dimensions.sm,
              }}
            >
              <Ionicons 
                name="arrow-back" 
                size={dimensions.iconLG} 
                color={theme.text} 
              />
            </TouchableOpacity>
            
            <Text
              style={{
                fontSize: dimensions.fontTitle-2,
                fontWeight: '800',
                textAlign: 'center',
                color: theme.text,
                marginHorizontal: dimensions.md,
              }}
            >
              {t("addTransaction.title")}
            </Text>
            
            {/* Boş alan - geri butonu ile başlık arasında denge için */}
            <View style={{ width: dimensions.iconLG + dimensions.sm * 2 }} />
          </View>

          {/* === Açıklama === */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: dimensions.lg,
            }}
          >

            <Text
              style={{
                fontSize: dimensions.fontMD,
                textAlign: 'center',
                color: theme.textSecondary,
                lineHeight: dimensions.fontLG + 3,
                maxWidth: '90%',
              }}
            >
              {t("addTransaction.description")}
            </Text>
          </View>

          {/* === Sekme Butonları === */}
          <View
            style={{
              marginBottom: dimensions.lg,
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: dimensions.borderRadiusXL,
              padding: dimensions.sm,
              gap: dimensions.sm,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setTab('expense')}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: dimensions.md,
                backgroundColor:
                  tab === 'expense'
                    ? theme.buttonsecondary
                    : 'transparent',
                borderRadius: dimensions.borderRadiusXL,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Text
                style={{
                  fontSize: dimensions.fontLG,
                  fontWeight: 'bold',
                  color:
                    tab === 'expense'
                      ? theme.text
                      : theme.textTertiary,
                }}
              >
                {t("addTransaction.tabs.expense")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setTab('income')}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: dimensions.md,
                backgroundColor:
                  tab === 'income'
                    ? theme.buttonsecondary
                    : 'transparent',
                borderRadius: dimensions.borderRadiusXL,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Text
                style={{
                  fontSize: dimensions.fontLG,
                  fontWeight: 'bold',
                  color:
                    tab === 'income'
                      ? theme.text
                      : theme.textTertiary,
                }}
              >
                {t("addTransaction.tabs.income")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* === Küçük AI Promosyonu === */}
          <View
            style={{
              marginBottom: dimensions.md,
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              borderRadius: dimensions.borderRadius,
              padding: dimensions.sm,
              borderWidth: 1,
              borderColor: 'rgba(99, 102, 241, 0.15)',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 16, marginRight: dimensions.sm }}>⚡</Text>
                <Text
                  style={{
                    fontSize: dimensions.fontMD,
                    fontWeight: '600',
                    color: theme.text,
                    flex: 1,
                  }}
                >
                  {t("addTransaction.aiPromo.title")}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/ai-chat")}
                style={{
                  backgroundColor: theme.primary,
                  paddingVertical: dimensions.xs,
                  paddingHorizontal: dimensions.sm,
                  borderRadius: dimensions.borderRadius,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: dimensions.fontSM,
                    fontWeight: '600',
                  }}
                >
                  {t("addTransaction.aiPromo.button")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* === Form === */}
          {tab === 'expense' ? <ExpenseEntry /> : <IncomeEntry />}
        </View>
      </ScrollView>
    </View>
  );
};

export default AddTransaction;
