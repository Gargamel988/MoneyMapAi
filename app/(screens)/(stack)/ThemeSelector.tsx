import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Theme } from "../../../src/constants/themes";
import { useTheme } from "../../../src/contexts/theme";
import { useResponsive } from "../../../src/hooks/useResponsive";
import { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from "../../../src/lib/adComponents";
import { getUnlockedThemes, PREMIUM_THEMES, unlockTheme } from "../../../src/lib/themeUnlock";

const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : (process.env.EXPO_PUBLIC_REWARDED_AD_UNIT_ID || TestIds.REWARDED);

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
  keywords: ["finance", "savings", "money", "design", "themes"],
});


export default function ThemeSelector() {
  const { theme, themeMode, setThemeMode, availableThemes } = useTheme();
  const { wp, hp, dimensions } = useResponsive();
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState(themeMode);
  const [unlockedThemes, setUnlockedThemes] = useState<Set<string>>(new Set());
  const [pendingUnlock, setPendingUnlock] = useState<string | null>(null);

  useEffect(() => {
    // Load unlocked themes
    const loadUnlocked = async () => {
      const unlocked = await getUnlockedThemes();
      setUnlockedThemes(new Set(unlocked));
    };
    loadUnlocked();

    // Ad listeners
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        if (pendingUnlock) {
          handleUnlockSuccess(pendingUnlock);
        }
      },
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setPendingUnlock(null);
        // Load the next ad immediately
        setTimeout(() => rewarded.load(), 500);
      }
    );

    const unsubscribeError = rewarded.addAdEventListener(
      AdEventType.ERROR,
      (error: any) => {
        console.error("Ad error:", error);
      }
    );

    // Initial load
    if (!rewarded.loaded) {
      rewarded.load();
    }

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [pendingUnlock]);

  const handleUnlockSuccess = async (themeKey: string) => {
    await unlockTheme(themeKey);
    setUnlockedThemes(prev => new Set([...prev, themeKey]));
    setSelectedTheme(themeKey);
    setThemeMode(themeKey);
    setPendingUnlock(null);
  };

  const handleThemeSelect = (themeKey: string) => {
    const isPremium = PREMIUM_THEMES.includes(themeKey);
    const isUnlocked = unlockedThemes.has(themeKey);

    if (isPremium && !isUnlocked) {
      Alert.alert(
        t("themeSelector.premium.unlockTitle"),
        t("themeSelector.premium.unlockMessage"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("themeSelector.premium.unlockButton"),
            onPress: () => {
              if (rewarded.loaded) {
                setPendingUnlock(themeKey);
                rewarded.show();
              } else {
                rewarded.load();
                Alert.alert(
                  t("common.loading"),
                  t("common.retry") + " (Ad is still loading...)"
                );
              }
            }
          }
        ]
      );
      return;
    }

    setSelectedTheme(themeKey);
    setThemeMode(themeKey);
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderThemeItem = (themeKey: string, themeData: Theme) => {
    const isSelected = selectedTheme === themeKey;
    const cardWidth = (wp(100) - wp(10) * 3) / 2;

    return (
      <TouchableOpacity
        key={themeKey}
        style={{
          width: cardWidth,
          marginBottom: dimensions.lg,
          borderRadius: dimensions.borderRadiusXL,
          overflow: "hidden",
          transform: isSelected ? [{ scale: 1.05 }] : [{ scale: 1 }],
          borderWidth: isSelected ? 3 : 1,
          borderColor: isSelected
            ? themeData.primary
            : "rgba(255, 255, 255, 0.2)",
        }}
        onPress={() => handleThemeSelect(themeKey)}
        activeOpacity={0.8}
      >
        {/* Tema Ã–nizleme KartÄ± */}
        <LinearGradient
          colors={themeData.gradientColors as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: hp(12),
            padding: dimensions.sm,
          }}
        >
          {/* Mini Uygulama Ã–nizlemesi */}
          <View
            style={{
              flex: 1,
              backgroundColor: themeData.summarycard,
              borderRadius: dimensions.borderRadius,
              padding: dimensions.sm,
              justifyContent: "space-between",
            }}
          >
            {/* Header */}
            <View
              style={{
                height: hp(0.8),
                backgroundColor: themeData.primary,
                borderRadius: dimensions.borderRadius,
                width: "60%",
              }}
            />

            {/* Content Lines */}
            <View style={{ gap: dimensions.sm }}>
              <View
                style={{
                  height: hp(0.7),
                  backgroundColor: themeData.textSecondary,
                  borderRadius: dimensions.borderRadius,
                  width: "80%",
                }}
              />
              <View
                style={{
                  height: hp(0.7),
                  backgroundColor: themeData.textSecondary,
                  borderRadius: dimensions.borderRadius,
                  width: "70%",
                }}
              />
              <View
                style={{
                  height: hp(0.7),
                  backgroundColor: themeData.textSecondary,
                  borderRadius: dimensions.borderRadius,
                  width: "50%",
                }}
              />
            </View>

            {/* Button */}
            <View
              style={{
                height: hp(1.2),
                backgroundColor: themeData.buttonprimary,
                borderRadius: dimensions.borderRadius,
                width: "40%",
              }}
            />
          </View>
        </LinearGradient>

        {/* Tema Bilgileri */}
        <View
          style={{
            padding: dimensions.sm,
            backgroundColor: theme.modalbackground,
          }}
        >
          <Text
            style={{
              fontSize: dimensions.fontMD,
              fontWeight: "700",
              marginBottom: dimensions.sm,
              color: theme.text,
              textAlign: "center",
            }}
          >
            {t(`themeSelector.themes.${themeKey}.name`, {
              defaultValue: themeData.name,
            })}
          </Text>
          <Text
            style={{
              fontSize: dimensions.fontXS,
              opacity: 0.8,
              color: theme.textSecondary,
              textAlign: "center",
              lineHeight: 16,
            }}
          >
            {t(`themeSelector.themes.${themeKey}.description`, {
              defaultValue: themeData.description,
            })}
          </Text>
        </View>

        {/* SeÃ§im Ä°ndikatÃ¶rÃ¼ */}
        {isSelected && (
          <View
            style={{
              position: "absolute",
              top: dimensions.sm,
              right: dimensions.sm,
              width: wp(7),
              height: wp(7),
              borderRadius: dimensions.borderRadius,
              backgroundColor: "#22C55E",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <Feather name="check" size={16} color="white" />
          </View>
        )}

        {/* Premium Kilit İkonu ve Karartma */}
        {PREMIUM_THEMES.includes(themeKey) && !unlockedThemes.has(themeKey) && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: dimensions.sm,
                borderRadius: dimensions.borderRadiusXL,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Feather name="lock" size={24} color="white" />
            </View>
          </View>
        )}

        {/* Premium Etiketi */}
        {PREMIUM_THEMES.includes(themeKey) && (
          <View
            style={{
              position: "absolute",
              top: dimensions.xs,
              left: dimensions.xs,
              backgroundColor: unlockedThemes.has(themeKey) ? "#22C55E" : "#EAB308",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
              zIndex: 11,
            }}
          >
            <Text style={{ color: "white", fontSize: 8, fontWeight: "900" }}>
              PREMIUM
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={theme.gradientColors as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: dimensions.lg,
          paddingTop: hp(5),
          paddingBottom: dimensions.lg,
        }}
      >
        <TouchableOpacity
          onPress={handleGoBack}

          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={wp(8)} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: dimensions.fontTitle,
              fontWeight: "800",
              textAlign: "center",
              color: theme.text,
              marginBottom: hp(0.5),
            }}
          >
            {t("themeSelector.title")}
          </Text>
          <Text
            style={{
              fontSize: dimensions.fontSM,
              textAlign: "center",
              color: theme.textSecondary,
              opacity: 0.8,
            }}
          >
            {t("themeSelector.subtitle")}
          </Text>
        </View>
      </View>

      {/* Tema Listesi */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: dimensions.lg,
          paddingBottom: dimensions.lg,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {availableThemes.map(({ key, theme: themeData }) =>
            renderThemeItem(key, themeData)
          )}
        </View>
      </ScrollView>


    </LinearGradient>
  );
}

