import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useResponsive";
import { BannerAd, BannerAdSize, TestIds } from "@/src/lib/adComponents";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ExpenseEntry } from "../../../src/components/transaction/expense";
import { IncomeEntry } from "../../../src/components/transaction/income";
import { ImportCSVSection } from "../../../src/components/transaction/ImportCSVSection";

const AddTransaction: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"expense" | "income">("expense");
  const [prefilledData, setPrefilledData] = useState<any>(null);
  const { dimensions, wp, hp } = useResponsive();
  const { theme } = useTheme();

  // Animation for tab indicator
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleTabChange = (newTab: "expense" | "income") => {
    Animated.spring(slideAnim, {
      toValue: newTab === "expense" ? 0 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
    setTab(newTab);
  };

  const handleImport = (data: any) => {
    const isIncome = data.type === 'gelir';
    setPrefilledData(data);
    handleTabChange(isIncome ? 'income' : 'expense');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: wp(5),
          paddingTop: hp(2),
          paddingBottom: dimensions.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="arrow-left" size={22} color={theme.text} />
          </TouchableOpacity>

          {/* Title */}
          <Text
            style={{
              fontSize: dimensions.fontXL,
              fontWeight: "800",
              color: theme.text,
              letterSpacing: -0.5,
            }}
          >
            {t("addTransaction.title")}
          </Text>

          {/* Placeholder for balance */}
          <View style={{ width: 40 }} />
        </View>

        {/* Subtitle */}
        <Text
          style={{
            marginTop: dimensions.sm,
            fontSize: dimensions.fontSM,
            color: theme.textSecondary,
            textAlign: "center",
          }}
        >
          {t("addTransaction.description")}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(5),
          paddingBottom: hp(4),
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 600,
            alignSelf: "center",
          }}
        >
          {/* Tab Buttons - Modern Pill Style */}
          <View
            style={{
              marginBottom: dimensions.lg,
              backgroundColor: theme.weeklycard,
              borderRadius: 16,
              padding: 4,
              flexDirection: "row",
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 2,
                },
              }),
            }}
          >
            {/* Animated Background Indicator */}
            <Animated.View
              style={{
                position: "absolute",
                top: 4,
                bottom: 4,
                left: 4,
                width: "49%",
                borderRadius: 12,
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, wp(43)],
                    }),
                  },
                ],
              }}
            >
              <LinearGradient
                colors={
                  tab === "expense"
                    ? ["#EF4444", "#DC2626"]
                    : ["#22C55E", "#16A34A"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flex: 1,
                  borderRadius: 12,
                }}
              />
            </Animated.View>

            {/* Expense Tab */}
            <Pressable
              onPress={() => handleTabChange("expense")}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: dimensions.md,
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Feather
                name="trending-down"
                size={18}
                color={tab === "expense" ? "#fff" : theme.textTertiary}
              />
              <Text
                style={{
                  fontSize: dimensions.fontMD,
                  fontWeight: "700",
                  color: tab === "expense" ? "#fff" : theme.textTertiary,
                }}
              >
                {t("addTransaction.tabs.expense")}
              </Text>
            </Pressable>

            {/* Income Tab */}
            <Pressable
              onPress={() => handleTabChange("income")}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: dimensions.md,
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Feather
                name="trending-up"
                size={18}
                color={tab === "income" ? "#fff" : theme.textTertiary}
              />
              <Text
                style={{
                  fontSize: dimensions.fontMD,
                  fontWeight: "700",
                  color: tab === "income" ? "#fff" : theme.textTertiary,
                }}
              >
                {t("addTransaction.tabs.income")}
              </Text>
            </Pressable>
          </View>

          {/* AI Promo Card - Modern Glassmorphism */}
          <Pressable
            onPress={() => router.push("/ai-chat")}
            style={({ pressed }) => ({
              marginBottom: dimensions.lg,
              borderRadius: 16,
              overflow: "hidden",
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <LinearGradient
              colors={["rgba(99, 102, 241, 0.15)", "rgba(139, 92, 246, 0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: dimensions.md,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                >
                  {/* AI Icon */}
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: "rgba(99, 102, 241, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: dimensions.sm,
                    }}
                  >
                    <Feather name="zap" size={20} color="#8B5CF6" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: dimensions.fontMD,
                        fontWeight: "700",
                        color: theme.text,
                      }}
                    >
                      {t("addTransaction.aiPromo.title")}
                    </Text>
                    <Text
                      style={{
                        fontSize: dimensions.fontXS,
                        color: theme.textSecondary,
                        marginTop: 2,
                      }}
                    >
                      {t("addTransaction.aiPromo.subtitle")}
                    </Text>
                  </View>
                </View>

                {/* Arrow */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#8B5CF6",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="arrow-right" size={16} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Import Section */}
          <ImportCSVSection onImport={handleImport} />

          {/* Form */}
          <View
            style={{
              backgroundColor: theme.weeklycard,
              borderRadius: 20,
              padding: dimensions.md,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            {tab === "expense" ? (
              <ExpenseEntry prefilledData={prefilledData} />
            ) : (
              <IncomeEntry prefilledData={prefilledData} />
            )}
          </View>
        </View>
      </ScrollView>
      <View style={{ alignItems: 'center', paddingBottom: hp(1) }}>
        <BannerAd
          unitId={__DEV__ ? TestIds.BANNER : (process.env.EXPO_PUBLIC_BANNER_AD_UNIT_ID || "ca-app-pub-1444133443338193/7822997870")}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
    </View>
  );
};

export default AddTransaction;


