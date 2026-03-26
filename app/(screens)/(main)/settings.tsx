import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ErrorFallback } from "../../../src/components/common/error";
import { GreenLoadingComponent } from "../../../src/components/common/loading";
import { CardSection } from "../../../src/components/setting/card-section";
import { ModalCurrency } from "../../../src/components/setting/modal-currency";
import { ItemRow } from "../../../src/components/setting/setting-item";
import { QUERY_KEYS } from "../../../src/constants/queryKeys";
import { useAuth } from "../../../src/hooks/useAuth";
import { useResponsive } from "../../../src/hooks/useResponsive";
import { exportToCSV } from "../../../src/lib/export/exportCSV";
import { exportToExcel } from "../../../src/lib/export/exportExcel";
import { exportToPDF } from "../../../src/lib/export/exportPDF";
import { getCurrency, getLanguage, updateCurrency } from "../../../src/lib/profile";
import { transactionsApi } from "../../../src/lib/transactions";
import { hexToRgba } from "../../../src/utils/hextorgba";
// @ts-ignore
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import appConfig from "../../../app.json";
import ModalLanguage from "../../../src/components/setting/modal-language";
import { showErrorToast, showSuccessToast } from "../../../src/constants/toast";
import { useTheme } from "../../../src/contexts/theme";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [showCurrencyModal, setShowCurrencyModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);

  const { theme } = useTheme();
  const { dimensions } = useResponsive();
  const queryClient = useQueryClient();
  const { signOut } = useAuth();

  const {
    data: currencydata,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.user.currency(),
    queryFn: getCurrency,
  });

  const {
    data: languageData,
  } = useQuery({
    queryKey: QUERY_KEYS.user.language(),
    queryFn: getLanguage,
  });
  const mutation = useMutation({
    mutationFn: async (currency: string) => {
      const data = await updateCurrency(currency);
      if (!data) {
        throw new Error(t("settings.currency.updateError"));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.currency() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.profile() });

      showSuccessToast(t("common.success"), t("settings.currency.updateSuccess"));
      setShowCurrencyModal(false);
    },
    onError: async () => {
      showErrorToast(t("common.error"), t("settings.currency.updateError"));
      setShowCurrencyModal(false);
    },
  });

  const Currency = currencydata?.currency;

  if (isLoading) return <GreenLoadingComponent />;

  if (error) return <ErrorFallback error={error as Error} />;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: dimensions.sm,
        }}
      >
        <Feather name="settings" size={dimensions.iconXL} color={theme.text} />
        <Text
          style={{
            fontSize: dimensions.fontTitle,
            fontWeight: "600",
            color: theme.text,
          }}
        >
          {t("settings.title")}
        </Text>
      </View>

      {showCurrencyModal && (
        <ModalCurrency
          showCurrencyModal={showCurrencyModal}
          setShowCurrencyModal={setShowCurrencyModal}
          currency={Currency}
          mutation={mutation}
        />
      )}

      <ScrollView>
        <CardSection title={t("settings.sections.account")}>
          <ItemRow
            iconName="user"
            title={t("settings.account.profile.title")}
            subtitle={t("settings.account.profile.subtitle")}
            showArrow
            onPress={() => router.push("/(screens)/(stack)/profile")}
          />
          <ItemRow
            iconName="clock"
            title={t("settings.account.history.title")}
            subtitle={t("settings.account.history.subtitle")}
            showArrow
            onPress={() => router.push("/(screens)/(stack)/history")}
          />
          <ItemRow
            iconName="log-out"
            title={t("settings.account.signOut.title")}
            subtitle={t("settings.account.signOut.subtitle")}
            showArrow
            onPress={() => signOut()}
            withDivider={false}
          />
        </CardSection>

        <CardSection title={t("settings.sections.general")}>
          <ItemRow
            iconName="sliders"
            title={t("settings.general.theme.title")}
            subtitle={t("settings.general.theme.subtitle")}
            showArrow
            onPress={() => router.push("/(screens)/(stack)/ThemeSelector")}
            withDivider={false}
          />
          <ItemRow
            iconName="dollar-sign"
            title={t("settings.general.currency.title")}
            subtitle={t("settings.general.currency.subtitle")}
            onPress={() => setShowCurrencyModal(true)}
            value={`${Currency} (${Currency === "USD"
              ? "$"
              : Currency === "EUR"
                ? "€"
                : Currency === "TRY"
                  ? "₺"
                  : Currency === "GBP"
                    ? "£"
                    : Currency === "JPY"
                      ? "¥"
                      : Currency === "CNY"
                        ? "¥"
                        : Currency
              })`}
          />
          <ItemRow
            iconName="globe"
            title={t("settings.general.language.title")}
            subtitle={t("settings.general.language.subtitle")}
            value={languageData?.language ? languageData?.language.toUpperCase() : "TR"}
            onPress={() => setShowLanguageModal(true)}
          />
          {showLanguageModal && (
            <ModalLanguage
              showLanguageModal={showLanguageModal}
              setShowLanguageModal={setShowLanguageModal}
              language={languageData?.language}
            />
          )}

          <ItemRow
            iconName="folder"
            title={t("settings.general.categories.title")}
            subtitle={t("settings.general.categories.subtitle")}
            showArrow
            onPress={() =>
              router.push("/(screens)/(stack)/categories" as never)
            }
          />
          <ItemRow
            iconName="repeat"
            title={t("settings.general.subscriptions.title")}
            subtitle={t("settings.general.subscriptions.subtitle")}
            showArrow
            onPress={() => router.push("/(screens)/(stack)/subscriptions" as never)}
          />
          <ItemRow
            iconName="target"
            title={t("settings.general.goals.title")}
            subtitle={t("settings.general.goals.subtitle")}
            showArrow
            onPress={() => router.push("/(screens)/(stack)/goals" as never)}
          />
        </CardSection>

        <CardSection title={t("settings.sections.data")}>
          <ItemRow
            iconName="download"
            title={t("settings.data.export.title")}
            subtitle={t("settings.data.export.subtitle")}
            showArrow
            onPress={() => setShowExportModal(true)}
          />
          <ItemRow
            iconName="trash-2"
            title={t("settings.data.clear.title")}
            subtitle={t("settings.data.clear.subtitle")}
            showArrow
            onPress={() => {
              Alert.alert(
                t("settings.data.clear.alert.title"),
                t("settings.data.clear.alert.message"),
                [
                  { text: t("settings.data.clear.alert.cancel"), style: "cancel" },
                  {
                    text: t("settings.data.clear.alert.delete"),
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await transactionsApi.deleteAllTransactions();
                        queryClient.invalidateQueries({
                          queryKey: QUERY_KEYS.transactions.all,
                        });
                        showSuccessToast(
                          t("common.success"),
                          t("settings.data.clear.success")
                        );
                      } catch (e: Error | unknown) {
                        showErrorToast(
                          t("common.error"),
                          t("settings.data.clear.error") + (e as Error)?.message
                        );
                      }
                    },
                  },
                ]
              );
            }}
            withDivider={false}
          />
        </CardSection>

        <CardSection title={t("settings.sections.about")}>
          <ItemRow
            iconName="info"
            title={t("settings.about.version.title")}
            subtitle={t("settings.about.version.subtitle")}
            value={appConfig?.expo?.version as string}
          />
          <ItemRow
            iconName="file-text"
            title={t("settings.about.terms.title")}
            subtitle={t("settings.about.terms.subtitle")}
            showArrow
            onPress={() => router.push("/(screens)/(stack)/terms-of-service")}
          />
          <ItemRow
            iconName="shield"
            title={t("settings.about.privacy.title")}
            subtitle={t("settings.about.privacy.subtitle")}
            showArrow
            onPress={() => router.push("/(screens)/(stack)/privacy-policy")}
            withDivider={false}
          />
        </CardSection>

        <View style={{ height: 24 }} />
      </ScrollView>
      {showExportModal && (
        <Modal
          visible={showExportModal}
          onRequestClose={() => setShowExportModal(false)}
          transparent={true}
          animationType="slide"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => setShowExportModal(false)}
            />
            <View
              style={{
                backgroundColor: theme.background,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                padding: 24,
                paddingBottom: 40,
                borderWidth: 1.5,
                borderColor: theme.cardBorder,
              }}
            >
              <Text
                style={{
                  marginBottom: 16,
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "800",
                  color: theme.text,
                }}
              >
                {t("settings.export.modal.title")}
              </Text>
              <View>
                <TouchableOpacity
                  disabled={exportLoading}
                  onPress={() => exportToCSV([], setExportLoading, "tum")}
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.1),
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: hexToRgba(theme.primary, 0.2),
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 16 }}>{t('settings.export.csv')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={exportLoading}
                  onPress={() => exportToExcel([], setExportLoading, "tum")}
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.1),
                    borderRadius: 16,
                    padding: 16,
                    marginTop: 12,
                    borderWidth: 1,
                    borderColor: hexToRgba(theme.primary, 0.2),
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 16 }}>{t('settings.export.excel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={exportLoading}
                  onPress={() => exportToPDF([], setExportLoading, "tum")}
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.1),
                    borderRadius: 16,
                    padding: 16,
                    marginTop: 12,
                    borderWidth: 1,
                    borderColor: hexToRgba(theme.primary, 0.2),
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 16 }}>{t('settings.export.pdf')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

