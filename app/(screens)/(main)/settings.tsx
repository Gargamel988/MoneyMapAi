import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
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
import { useAuth } from "../../../src/hooks/useAuth";
import { useResponsive } from "../../../src/hooks/useRespons";
import { exportToCSV } from "../../../src/lib/export/exportCSV";
import { exportToExcel } from "../../../src/lib/export/exportExcel";
import { exportToPDF } from "../../../src/lib/export/exportPDF";
import { getCurrency, getLanguage, updatecurrency } from "../../../src/lib/profil";
import { transactionsApi } from "../../../src/lib/transactions";
// @ts-ignore
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import appConfig from "../../../app.json";
import ModalLanguage from "../../../src/components/setting/modal-language";
import { showErrorToast, showSuccessToast } from "../../../src/constanst/toast";
import { useTheme } from "../../../src/contexts/theme";
export default function SettingsScreen() {
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
    queryKey: ["currency"],
    queryFn: getCurrency,
  });

  const {
    data: languageData,
  } = useQuery({
    queryKey: ["language"],
    queryFn: getLanguage,
  });
  const mutation = useMutation({
    mutationFn: async (currency: string) => {
      const data = await updatecurrency(currency);
      if (!data) {
        throw new Error("Para birimi güncellenemedi");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      showSuccessToast("Başarılı", "Para birimi güncellendi");
      setShowCurrencyModal(false);
    },
    onError: async () => {
      showErrorToast("Hata", "Para birimi güncellenemedi");
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
          Ayarlar
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
        <CardSection title="hesap">
          <ItemRow
            iconName="user"
            title="profil"
            subtitle="profili düzenle"
            showArrow
            onPress={() => router.push("/(screens)/(stack)/profile")}
          />
          <ItemRow
            iconName="clock"
            title="geçmiş"
            subtitle="geçmiş işlemlerinizi görüntüle"
            showArrow
            onPress={() => router.push("/(screens)/(stack)/history")}
          />
          <ItemRow
            iconName="log-out"
            title="çıkış yap"
            subtitle="hesabından çıkış yap"
            showArrow
            onPress={() => signOut()}
            withDivider={false}
          />
        </CardSection>

        <CardSection title="genel ayarlar">
          <ItemRow
            iconName="sliders"
            title="tema"
            subtitle="uygulama temasını seç"
            showArrow
            onPress={() => router.push("/(screens)/(stack)/ThemeSelector")}
            withDivider={false}
          />
          <ItemRow
            iconName="dollar-sign"
            title="para birimi"
            subtitle="varsayılan para birimi"
            onPress={() => setShowCurrencyModal(true)}
            value={`${Currency} (${
              Currency === "USD"
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
            title="dil"
            subtitle="uygulama dilini seç"
            value={languageData?.language.toUpperCase()}
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
            title="kategori yönetimi"
            subtitle="kategori yönetimi"
            showArrow
            onPress={() =>
              router.push("/(screens)/(stack)/categories" as never)
            }
          />
        </CardSection>

        <CardSection title="veri yönetimi">
          <ItemRow
            iconName="download"
            title="veri aktarımı"
            subtitle="veri aktarımı"
            showArrow
            onPress={() => setShowExportModal(true)}
          />
          <ItemRow
            iconName="trash-2"
            title="veri temizle"
            subtitle="veri temizle"
            showArrow
            onPress={() => {
              Alert.alert("Verileri Temizle", "Tüm işlemler silinsin mi?", [
                { text: "İptal", style: "cancel" },
                {
                  text: "Sil",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await transactionsApi.deleteAllTransactions();
                      queryClient.invalidateQueries({
                        queryKey: ["allTables"],
                      });
                      showSuccessToast("Başarılı", "Tüm veriler silindi");
                    } catch (e: Error | unknown) {
                      showErrorToast("Hata", "Veriler silinemedi" + (e as Error)?.message);
                    }
                  },
                },
              ]);
            }}
            withDivider={false}
          />
        </CardSection>

        <CardSection title="hakkında">
          <ItemRow
            iconName="info"
            title="versiyon"
            subtitle="uygulama versiyonu"
            value={appConfig?.expo?.version as string}
          />
          <ItemRow
            iconName="file-text"
            title="kullanım şartları"
            subtitle="kullanım şartlarını görüntüle"
            showArrow
            onPress={() => router.push("/(screens)/(stack)/terms-of-service")}
          />
          <ItemRow
            iconName="shield"
            title="gizlilik politikası"
            subtitle="gizlilik politikasını görüntüle"
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
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1, width: "100%" }}
              activeOpacity={1}
              onPress={() => setShowExportModal(false)}
            />
            <View
              style={{
                width: "100%",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 24,
              }}
            >
              <Text
                style={{
                  marginBottom: 16,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "700",
                  color: theme.textPrimary,
                }}
              >
                veri aktarımı
              </Text>
              <View>
                <TouchableOpacity
                  disabled={exportLoading}
                  onPress={() => exportToCSV([], setExportLoading, "tum")}
                  style={{
                    backgroundColor: theme.white,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <Text style={{ color: theme.textPrimary }}>csv</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={exportLoading}
                  onPress={() => exportToExcel([], setExportLoading, "tum")}
                  style={{
                    backgroundColor: theme.white,
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 12,
                  }}
                >
                  <Text style={{ color: theme.textPrimary }}>EXCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={exportLoading}
                  onPress={() => exportToPDF([], setExportLoading, "tum")}
                  style={{
                    backgroundColor: theme.white,
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 12,
                  }}
                >
                  <Text style={{ color: theme.textPrimary }}>PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
