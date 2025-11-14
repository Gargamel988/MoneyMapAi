import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { showErrorToast, showSuccessToast } from "../../constanst/toast";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useRespons";
import { updateDefaultCategoriesByLanguage } from "../../lib/category";
import { updateLanguage } from "../../lib/profil";

interface ModalLanguageProps {
  showLanguageModal: boolean;
  setShowLanguageModal: (visible: boolean) => void;
  language?: string | null;
}

const languageOptions = [
  { code: "tr", flag: "🇹🇷" },
  { code: "en", flag: "🇺🇸" },
];

const ModalLanguage = ({
  showLanguageModal,
  setShowLanguageModal,
  language,
}: ModalLanguageProps) => {
  const { theme } = useTheme();
  const { dimensions } = useResponsive();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const activeLanguage = (language || i18n.language || "tr").split("-")[0];

  const handleSelectLanguage = async (code: string) => {
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
        // Kategori query'lerini invalidate et
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

  return (
    <Modal
      animationType="fade"
      transparent
      visible={showLanguageModal}
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme.modalbackground,
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (!isUpdating) {
              setShowLanguageModal(false);
            }
          }}
          style={{ flex: 1 }}
        />

        <View
          style={{
            backgroundColor: theme.white,
            borderTopLeftRadius: dimensions.borderRadiusXL,
            borderTopRightRadius: dimensions.borderRadiusXL,
            paddingHorizontal: dimensions.md,
            paddingTop: dimensions.xl,
            paddingBottom: dimensions.lg,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: dimensions.lg }}>
            <View
              style={{
                height: 4,
                width: 48,
                borderRadius: dimensions.borderRadius,
                backgroundColor: theme.border,
                marginBottom: dimensions.lg,
              }}
            />
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: dimensions.fontXL,
                    fontWeight: "700",
                    color: theme.inputtitle,
                  }}
                >
                  {t("languageModal.title")}
                </Text>
                <Text
                  style={{
                    marginTop: dimensions.xs,
                    fontSize: dimensions.fontSM,
                    color: theme.textTertiary,
                  }}
                >
                  {t("languageModal.subtitle")}
                </Text>
                <Text
                  style={{
                    marginTop: dimensions.xs,
                    fontSize: dimensions.fontSM,
                    color: theme.textSecondary,
                  }}
                >
                  {t("languageModal.current", {
                    language: t(`languageModal.option.${activeLanguage}`),
                  })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowLanguageModal(false)}
                accessibilityLabel={t("languageModal.close")}
                style={{
                  marginLeft: dimensions.md,
                  height: dimensions.iconLG,
                  width: dimensions.iconLG,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: dimensions.borderRadiusLG,
                  backgroundColor: theme.inputbackground,
                }}
              >
                <Text
                  style={{
                    color: theme.inputtitle,
                    fontSize: dimensions.fontLG,
                    fontWeight: "700",
                  }}
                >
                  ×
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ gap: dimensions.md }}>
            {languageOptions.map((option) => {
              const isSelected = activeLanguage === option.code;
              return (
                <TouchableOpacity
                  key={option.code}
                  activeOpacity={0.7}
                  onPress={() => handleSelectLanguage(option.code)}
                  disabled={isUpdating}
                  style={{
                    borderRadius: dimensions.borderRadiusXL,
                    paddingVertical: dimensions.md,
                    paddingHorizontal: dimensions.md,
                    backgroundColor: isSelected
                      ? theme.primary
                      : theme.inputbackground,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        height: dimensions.iconXL,
                        width: dimensions.iconXL,
                        borderRadius: dimensions.borderRadiusLG,
                        backgroundColor: isSelected
                          ? "rgba(255,255,255,0.2)"
                          : theme.white,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: dimensions.md,
                      }}
                    >
                      <Text style={{ fontSize: dimensions.fontXL }}>
                        {option.flag}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: dimensions.fontMD,
                          fontWeight: "600",
                          color: isSelected ? theme.white : theme.inputtitle,
                          marginBottom: dimensions.xs,
                        }}
                      >
                        {t(`languageModal.option.${option.code}`)}
                      </Text>
                      <Text
                        style={{
                          fontSize: dimensions.fontSM,
                          color: isSelected
                            ? "rgba(255,255,255,0.85)"
                            : theme.textTertiary,
                        }}
                      >
                        {t(`languageModal.optionDesc.${option.code}`)}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "center", justifyContent: "center" }}>
                    {isSelected ? (
                      <View
                        style={{
                          height: dimensions.iconSM,
                          width: dimensions.iconSM,
                          borderRadius: dimensions.iconSM,
                          backgroundColor: theme.white,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: theme.primary,
                            fontWeight: "700",
                          }}
                        >
                          ✓
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {isUpdating && (
            <View
              style={{
                marginTop: dimensions.lg,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: dimensions.sm,
              }}
            >
              <ActivityIndicator size="small" color={theme.primary} />
              <Text
                style={{
                  fontSize: dimensions.fontSM,
                  color: theme.textTertiary,
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
