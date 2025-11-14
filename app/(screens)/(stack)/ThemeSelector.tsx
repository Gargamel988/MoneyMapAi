import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Theme } from "../../../src/constanst/themes";
import { useTheme } from "../../../src/contexts/theme";
import { useResponsive } from "../../../src/hooks/useRespons";

export default function ThemeSelector() {
  const { theme, themeMode, setThemeMode, availableThemes } = useTheme();
  const { wp, hp, dimensions } = useResponsive();
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState(themeMode);

  const handleThemeSelect = (themeKey: string) => {
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
        {/* Tema Önizleme Kartı */}
        <LinearGradient
          colors={themeData.gradientColors as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: hp(12),
            padding: dimensions.sm,
          }}
        >
          {/* Mini Uygulama Önizlemesi */}
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

        {/* Seçim İndikatörü */}
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
            }}
          >
            <Feather name="check" size={16} color="white" />
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

      {/* Footer */}
      <View
        style={{
          paddingHorizontal: dimensions.lg,
          paddingBottom: hp(4),
          paddingTop: dimensions.lg,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <TouchableOpacity
          style={{
            height: hp(8),
            borderRadius: dimensions.borderRadiusLG*2,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.primary,
            flexDirection: "row",
            gap: dimensions.sm,
          }}
          onPress={handleGoBack}
          activeOpacity={0.8}
        >
          <Feather name="check-circle" size={wp(8)} color={theme.text} />
          <Text
            style={{
              fontSize: dimensions.fontLG,
              fontWeight: "700",
              color: theme.text,
            }}
          >
            {t("themeSelector.applyButton")}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: dimensions.fontXS,
            color: theme.textSecondary,
            textAlign: "center",
            marginTop: dimensions.sm,
            opacity: 0.7,
          }}
        >
          {t("themeSelector.applyDescription")}
        </Text>
      </View>
    </LinearGradient>
  );
}
