import { useResponsive } from "@/src/hooks/useResponsive";
import Feather from "@expo/vector-icons/Feather";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { showErrorToast, showSuccessToast } from "../../constants/toast";
import { useTheme } from "../../contexts/theme";
import { updateDefaultCategoriesByLanguage } from "../../lib/category";
import { updateLanguage } from "../../lib/profile";

type LanguageCode = "tr" | "en";

type LanguageOption = {
  code: LanguageCode;
  flag: string;
  nativeName: string;
};

interface ModalLanguageProps {
  showLanguageModal: boolean;
  setShowLanguageModal: (visible: boolean) => void;
  language?: string | null;
}

const languageOptions: LanguageOption[] = [
  { code: "tr", flag: "🇹🇷", nativeName: "Türkçe" },
  { code: "en", flag: "🇺🇸", nativeName: "English" },
];

const ModalLanguage = ({
  showLanguageModal,
  setShowLanguageModal,
  language,
}: ModalLanguageProps) => {
  const { theme } = useTheme();
  const { dimensions, hp, wp } = useResponsive();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const activeLanguage = (language || i18n.language || "tr").split("-")[0] as LanguageCode;

  const handleSelectLanguage = async (code: LanguageCode) => {
    if (isUpdating || code === activeLanguage) {
      if (code === activeLanguage) {
        setShowLanguageModal(false);
      }
      return;
    }

    try {
      setIsUpdating(true);
      const response = await updateLanguage(code);

      if (!response) {
        throw new Error("language-update-failed");
      }

      // Kategorileri yeni dile göre güncelle
      const categoryUpdateResult = await updateDefaultCategoriesByLanguage(code);
      if (categoryUpdateResult.success) {
        await queryClient.invalidateQueries({ queryKey: ["categories"] });
        await queryClient.invalidateQueries({ queryKey: ["income_categories"] });
        await queryClient.invalidateQueries({ queryKey: ["expense_categories"] });
      }

      await i18n.changeLanguage(code);
      await queryClient.invalidateQueries({ queryKey: ["language"] });

      showSuccessToast(
        t("languageModal.toastSuccessTitle"),
        t("languageModal.toastSuccessMessage", {
          language: t(`languageModal.option.${code}`),
        })
      );
      setShowLanguageModal(false);
    } catch (error) {
      console.error("handleSelectLanguage", error);
      showErrorToast(
        t("languageModal.toastErrorTitle"),
        t("languageModal.toastErrorMessage")
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const LanguageItem = ({
    option,
    isSelected,
  }: {
    option: LanguageOption;
    isSelected: boolean;
  }) => (
    <Pressable
      onPress={() => handleSelectLanguage(option.code)}
      disabled={isUpdating}
      style={({ pressed }) => ({
        marginBottom: dimensions.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: dimensions.borderRadiusLG,
        padding: dimensions.md,
        backgroundColor: isSelected
          ? theme.primary
          : pressed
            ? `${theme.primary}15`
            : theme.weeklycard,
        borderWidth: isSelected ? 0 : 1,
        borderColor: isSelected ? "transparent" : theme.bordersecondary,
        opacity: isUpdating && !isSelected ? 0.5 : 1,
        transform: [{ scale: pressed && !isUpdating ? 0.98 : 1 }],
      })}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        {/* Flag Container */}
        <View
          style={{
            marginRight: dimensions.md,
            width: dimensions.iconXL + 8,
            height: dimensions.iconXL + 8,
            borderRadius: dimensions.borderRadiusLG,
            backgroundColor: isSelected
              ? "rgba(255, 255, 255, 0.2)"
              : `${theme.primary}10`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: dimensions.fontXL + 4 }}>{option.flag}</Text>
        </View>

        {/* Language Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              style={{
                fontSize: dimensions.fontMD,
                fontWeight: "700",
                color: isSelected ? "#fff" : theme.inputtitle,
                letterSpacing: 0.3,
              }}
            >
              {t(`languageModal.option.${option.code}`)}
            </Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 6,
                backgroundColor: isSelected
                  ? "rgba(255,255,255,0.2)"
                  : `${theme.primary}15`,
              }}
            >
              <Text
                style={{
                  fontSize: dimensions.fontXS,
                  fontWeight: "600",
                  color: isSelected ? "#fff" : theme.primary,
                  textTransform: "uppercase",
                }}
              >
                {option.code}
              </Text>
            </View>
          </View>
          <Text
            style={{
              marginTop: 4,
              fontSize: dimensions.fontSM,
              color: isSelected ? "rgba(255, 255, 255, 0.8)" : theme.textTertiary,
            }}
          >
            {option.nativeName} • {t(`languageModal.optionDesc.${option.code}`)}
          </Text>
        </View>
      </View>

      {/* Checkmark or Loading */}
      {isUpdating && !isSelected ? (
        <ActivityIndicator size="small" color={theme.primary} />
      ) : isSelected ? (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="check" size={16} color={theme.primary} />
        </View>
      ) : null}
    </Pressable>
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={showLanguageModal}
      onRequestClose={() => setShowLanguageModal(false)}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme.modalbackground,
          justifyContent: "flex-end",
        }}
      >
        {/* Backdrop tap to close */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (!isUpdating) {
              setShowLanguageModal(false);
            }
          }}
          style={{ flex: 1 }}
        />

        {/* Modal Content */}
        <View
          style={{
            backgroundColor: theme.white,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: wp(5),
            paddingTop: dimensions.lg,
            paddingBottom: hp(4),
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
              },
              android: {
                elevation: 24,
              },
            }),
          }}
        >
          {/* Drag Handle */}
          <View style={{ alignItems: "center", marginBottom: dimensions.md }}>
            <View
              style={{
                width: 40,
                height: 5,
                borderRadius: 3,
                backgroundColor: theme.bordersecondary,
              }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: dimensions.lg,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: dimensions.fontXL + 2,
                  fontWeight: "800",
                  color: theme.inputtitle,
                  letterSpacing: -0.5,
                }}
              >
                {t("languageModal.title")}
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  fontSize: dimensions.fontSM,
                  color: theme.textQuinary,
                }}
              >
                {t("languageModal.subtitle")}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: dimensions.fontSM,
                  color: theme.textQuinary,
                }}
              >
                {t("languageModal.current", {
                  language: "",
                })}
                <Text style={{ fontWeight: "600", color: theme.primary }}>
                  {t(`languageModal.option.${activeLanguage}`)}
                </Text>
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowLanguageModal(false)}
              accessibilityLabel={t("languageModal.close")}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              disabled={isUpdating}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: theme.bordersecondary,
                alignItems: "center",
                justifyContent: "center",
                opacity: isUpdating ? 0.5 : 1,
              }}
            >
              <Feather name="x" size={18} color={theme.textQuinary} />
            </TouchableOpacity>
          </View>

          {/* Language Options */}
          <View>
            {languageOptions.map((option) => (
              <LanguageItem
                key={option.code}
                option={option}
                isSelected={activeLanguage === option.code}
              />
            ))}
          </View>

          {/* Loading State */}
          {isUpdating && (
            <View
              style={{
                marginTop: dimensions.lg,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: dimensions.sm,
                padding: dimensions.md,
                backgroundColor: `${theme.primary}10`,
                borderRadius: dimensions.borderRadiusLG,
              }}
            >
              <ActivityIndicator size="small" color={theme.primary} />
              <Text
                style={{
                  fontSize: dimensions.fontSM,
                  fontWeight: "500",
                  color: theme.primary,
                }}
              >
                {t("languageModal.loading")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ModalLanguage;
