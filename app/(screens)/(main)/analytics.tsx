import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// lib
import { exportToCSV } from "../../../src/lib/export/exportCSV";
import { exportToExcel } from "../../../src/lib/export/exportExcel";
import { exportToPDF } from "../../../src/lib/export/exportPDF";
import { transactionsApi } from "../../../src/lib/transactions";
// components
import Pascalcase from "../../../src/components/charts/pascal-case";
import PieChart from "../../../src/components/charts/pie-chart";
import FinanceSummary from "../../../src/components/finance/fınance-summary";
import TopFiveExpenses from "../../../src/components/finance/top-five-expenses";
import { useTheme } from "../../../src/contexts/theme";
import { useResponsive } from "../../../src/hooks/useRespons";
import { getCurrency } from "../../../src/lib/profil";
import { Transaction, TransactionList } from "../../../src/types/transactıonstype";

type TabType = "Günlük" | "Haftalık" | "Aylık" | "Yıllık";

export default function Analytics() {
  const [tab, setTab] = useState<TabType>("Aylık");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { theme } = useTheme();
  const { hp } = useResponsive();
  
  const { data: currencyQuery } = useQuery({
    queryKey: ["currency"],
    queryFn: getCurrency,
  });
  const currency = currencyQuery?.currency;

  const queryMap = {
    Günlük: ["day", () => transactionsApi.getTransactionsByDay()],
    Haftalık: ["week", () => transactionsApi.getTransactionsBySevenDaysAgo()],
    Aylık: ["month", () => transactionsApi.getTransactionsByMonth()],
    Yıllık: ["year", () => transactionsApi.getTransactionsByYear()],
  } as { [key in TabType]: [string, () => Promise<TransactionList>] };


  const [key, fn] = queryMap[tab];
  const {
    data: dataTransactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", key],
    queryFn: fn,
  });


  const data = Array.isArray(dataTransactions) ? dataTransactions : [];
  const piechartData = data.filter((item: Transaction) => item.type === "gider");



  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16, backgroundColor: theme.headerbackground }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
            <View style={{ marginBottom: 16, marginTop: 8 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: "bold",
                  color: theme.text,
                }}
              >
                Finansal Analiz ve Raporlar
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  textAlign: "center",
                  fontSize: 14,
                  color: theme.textSecondary,
                }}
              >
                Gelir ve giderlerinizi detaylı inceleyin
              </Text>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  marginBottom: 12,
                  fontSize: 16,
                  fontWeight: "600",
                  color: theme.text,
                }}
              >
                Dönem Seçimi
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                {(["Günlük", "Haftalık", "Aylık", "Yıllık"] as TabType[]).map(
                  (period) => (
                    <TouchableOpacity
                      key={period}
                      activeOpacity={0.7}
                      onPress={() => setTab(period)}
                      style={{
                        minWidth: 80,
                        alignItems: "center",
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        backgroundColor:
                          tab === period
                            ? "#FFFFFF"
                            : "rgba(255, 255, 255, 0.1)",
                        borderWidth: 1,
                        borderColor:
                          tab === period
                            ? "transparent"
                            : "rgba(255, 255, 255, 0.2)",
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 14,
                          fontWeight: "500",
                          color: tab === period ? "#111827" : "#FFFFFF",
                        }}
                      >
                        {period}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              {/* Küçük AI Analiz Önerisi */}
              <TouchableOpacity
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  borderWidth: 1,
                  borderColor: "rgba(99, 102, 241, 0.25)",
                }}
                activeOpacity={0.8}
                onPress={() => router.push("/ai-chat")}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Text style={{ fontSize: 14 }}>🔍</Text>
                  <Text
                    style={{ fontSize: 12, fontWeight: "500", color: "white" }}
                  >
                    AI Analiz
                  </Text>
                </View>
                <Feather
                  name="arrow-right"
                  size={16}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              {/* Rapor İndirme */}
              <TouchableOpacity
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
                activeOpacity={0.8}
                onPress={() => setShowModal(!showModal)}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Feather name="download" size={18} color="#FFFFFF" />
                  <Text
                    style={{ fontSize: 14, fontWeight: "500", color: "white" }}
                  >
                    Rapor İndir
                  </Text>
                </View>
                <Feather
                  name={showModal ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              {showModal && (
                <View
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 12,
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <TouchableOpacity
                    disabled={isLoading || loading}
                    activeOpacity={0.7}
                    style={[
                      styles.exportButton,
                      {
                        backgroundColor: "#16A34A",
                        opacity: loading ? 0.5 : 1,
                      },
                    ]}
                    onPress={() =>
                      Alert.alert(
                        "Excel Raporu",
                        `${tab} dönemi Excel dosyası oluşturulsun mu?`,
                        [
                          { text: "İptal", style: "cancel" },
                          {
                            text: "Oluştur",
                            onPress: () =>
                              exportToExcel(dataTransactions as TransactionList, setLoading, tab),
                          },
                        ]
                      )
                    }
                  >
                    <Text style={styles.exportText}>Excel</Text>
                    <Feather name="download" size={16} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={isLoading || loading}
                    activeOpacity={0.7}
                    style={[
                      styles.exportButton,
                      {
                        backgroundColor: "#2563EB",
                        opacity: loading ? 0.5 : 1,
                      },
                    ]}
                    onPress={() =>
                      Alert.alert(
                        "CSV Raporu",
                        `${tab} dönemi CSV dosyası oluşturulsun mu?`,
                        [
                          { text: "İptal", style: "cancel" },
                          {
                            text: "Oluştur",
                            onPress: () =>
                              exportToCSV(dataTransactions as TransactionList, setLoading, tab),
                          },
                        ]
                      )
                    }
                  >
                    <Text style={styles.exportText}>CSV</Text>
                    <Feather name="download" size={16} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={isLoading || loading}
                    activeOpacity={0.7}
                    style={[
                      styles.exportButton,
                      {
                        backgroundColor: "#DC2626",
                        opacity: loading ? 0.5 : 1,
                      },
                    ]}
                    onPress={() =>
                      Alert.alert(
                        "PDF Raporu",
                        `${tab} dönemi PDF dosyası oluşturulsun mu?`,
                        [
                          { text: "İptal", style: "cancel" },
                          {
                            text: "Oluştur",
                            onPress: () =>
                              exportToPDF(dataTransactions as TransactionList, setLoading, tab),
                          },
                        ]
                      )
                    }
                  >
                    <Text style={styles.exportText}>PDF</Text>
                    <Feather name="download" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        nestedScrollEnabled={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView edges={["bottom"]} style={{ gap: hp(2) }}>
    
          <FinanceSummary
            isLoading={isLoading}
            error={error as Error}
            data={data}
            currency={currency}
            tabs={tab}
          />

    
    
          <PieChart
            data={piechartData}
            isLoading={isLoading}
            error={error as Error}
            currency={currency}
            tabs={tab as "daily" | "weekly" | "monthly" | "yearly"}
          />

          {/* Top 5 Harcamalar */}
        
          <TopFiveExpenses
            data={dataTransactions || []}
            isLoading={isLoading}
            error={error as Error}
            currency={currency}
          />

        

          {/* Gelir-Gider Karşılaştırması */}
      
          <Pascalcase
            data={dataTransactions || []}
            isLoading={isLoading}
            error={error as Error}
            currency={currency || "TRY"}
          />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  exportButton: {
    minWidth: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  exportText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});
