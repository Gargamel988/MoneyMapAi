import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
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
import { Select } from "../../../src/components/ui/select";
import { useTheme } from "../../../src/contexts/theme";
import { useResponsive } from "../../../src/hooks/useRespons";
import { getCurrency } from "../../../src/lib/profil";
import {
  Transaction,
  TransactionList,
} from "../../../src/types/transactıonstype";

type TabType = "daily" | "weekly" | "monthly" | "yearly";

export default function Analytics() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabType>("monthly");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reportFormat, setReportFormat] = useState<"excel" | "csv" | "pdf">(
    "excel"
  );
  const { theme } = useTheme();
  const { hp, dimensions } = useResponsive();

  const { data: currencyQuery } = useQuery({
    queryKey: ["currency"],
    queryFn: getCurrency,
  });
  const currency = currencyQuery?.currency;

  const queryMap = {
    daily: ["day", () => transactionsApi.getTransactionsByDay()],
    weekly: ["week", () => transactionsApi.getTransactionsBySevenDaysAgo()],
    monthly: ["month", () => transactionsApi.getTransactionsByMonth()],
    yearly: ["year", () => transactionsApi.getTransactionsByYear()],
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
  const {data: dataAllTables} = useQuery({
    queryKey: ["allTables"],
    queryFn: () => transactionsApi.getallTables(),
  });

  const data = Array.isArray(dataTransactions) ? dataTransactions : [];
  const piechartData = data.filter(
    (item: Transaction) => item.type === "gider"
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          backgroundColor: theme.headerbackground,
        }}
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
                {t("analytics.title")}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  textAlign: "center",
                  fontSize: 14,
                  color: theme.textSecondary,
                }}
              >
                {t("analytics.description")}
              </Text>
            </View>

            <View
              style={{
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: dimensions.fontMD,
                    textAlign: "center",
                    color: theme.text,
                    marginBottom: 8,
                    fontWeight: "bold",
                  }}
                >
                  {t("analytics.selectPeriod")}
                </Text>
                <Select
                  options={[
                    { label: t("analytics.periods.daily"), value: "daily" },
                    { label: t("analytics.periods.weekly"), value: "weekly" },
                    { label: t("analytics.periods.monthly"), value: "monthly" },
                    { label: t("analytics.periods.yearly"), value: "yearly" },
                  ]}
                  placeholder={t("analytics.selectPeriod")}
                  value={tab}
                  onValueChange={(value) => setTab(value as TabType)}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: dimensions.fontMD,
                    textAlign: "center",
                    color: theme.text,
                    marginBottom: 8,
                    fontWeight: "bold",
                  }}
                >
                  {t("analytics.selectFormat")}
                </Text>
              <Select
                options={[
                  { label: t("analytics.formats.excel"), value: "excel" },
                  { label: t("analytics.formats.csv"), value: "csv" },
                  { label: t("analytics.formats.pdf"), value: "pdf" },
                ]}
                placeholder={t("analytics.formatPlaceholder")}
                onAlertMessage={(value) => {
                  const formatLabel = t(`analytics.formats.${value}`);
                  const periodLabel = t(`analytics.periods.${tab}`);
                  Alert.alert(
                    t("analytics.alert.title", { format: formatLabel }),
                    t("analytics.alert.message", {
                      period: periodLabel,
                      format: formatLabel,
                    }),
                    [
                      { text: t("analytics.alert.cancel"), style: "cancel" },
                      {
                        text: t("analytics.alert.create"),
                        onPress: () => {
                          if (value === "excel") {
                            exportToExcel(
                              dataTransactions as TransactionList,
                              setLoading,
                              tab
                            );
                          } else if (value === "csv") {
                            exportToCSV(
                              dataTransactions as TransactionList,
                              setLoading,
                              tab
                            );
                          } else if (value === "pdf") {
                            exportToPDF(
                              dataTransactions as TransactionList,
                              setLoading,
                              tab
                            );
                          }
                        },
                      },
                    ]
                  );
                }}
                onValueChange={(value) =>
                  setReportFormat(value as "excel" | "csv" | "pdf")
                }
                value={reportFormat}
              />
              </View>

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
            data={ dataAllTables || []}
            isLoading={isLoading}
            error={error as Error}
            currency={currency || "TRY"}
          />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
