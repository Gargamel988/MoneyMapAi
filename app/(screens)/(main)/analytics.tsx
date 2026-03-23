import { useQuery } from "@tanstack/react-query";
import { BannerAd, BannerAdSize, TestIds, RewardedAd, RewardedAdEventType } from "@/src/lib/adComponents";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QUERY_KEYS } from "../../../src/constants/queryKeys";

// lib
import { exportToCSV } from "../../../src/lib/export/exportCSV";
import { exportToExcel } from "../../../src/lib/export/exportExcel";
import { exportToPDF } from "../../../src/lib/export/exportPDF";
import { transactionsApi } from "../../../src/lib/transactions";
// components
import Pascalcase from "../../../src/components/charts/pascal-case";
import PieChart from "../../../src/components/charts/pie-chart";
import FinanceSummary from "../../../src/components/finance/finance-summary";
import TopFiveExpenses from "../../../src/components/finance/top-five-expenses";
import { MonthlyComparison } from "../../../src/components/finance/monthly-comparison";
import { Select } from "../../../src/components/ui/select";
import { useTheme } from "../../../src/contexts/theme";
import { useResponsive } from "../../../src/hooks/useResponsive";
import { getCurrency } from "../../../src/lib/profile";
import {
  Transaction,
  TransactionList,
} from "../../../src/types/transactionTypes";

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : (process.env.EXPO_PUBLIC_BANNER_AD_UNIT_ID || "ca-app-pub-1444133443338193/7817807734");
const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : (process.env.EXPO_PUBLIC_REWARDED_AD_UNIT_ID || "ca-app-pub-1444133443338193/7630672720");

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
  keywords: ["finance", "savings", "money"],
});

type TabType = "daily" | "weekly" | "monthly" | "yearly";

export default function AnalyticsScreen() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabType>("monthly");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reportFormat, setReportFormat] = useState<"excel" | "csv" | "pdf">(
    "excel"
  );
  const { theme } = useTheme();
  const { hp, dimensions } = useResponsive();

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log("Analytics Rewarded ad loaded");
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward: any) => {
        console.log("User earned reward for export: ", reward);
      },
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const showRewardedAd = (callback: () => void) => {
    if (rewarded.loaded) {
      rewarded.show().then(() => {
        callback();
        rewarded.load(); // Reload for next time
      });
    } else {
      // If ad not loaded yet, allow anyway but try to load
      callback();
      rewarded.load();
    }
  };

  const { data: currencyQuery } = useQuery({
    queryKey: QUERY_KEYS.user.currency(),
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
    queryKey: QUERY_KEYS.transactions.byPeriod(key),
    queryFn: fn,
  });
  const { data: dataAllTables } = useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: () => transactionsApi.getAllTransactions(),
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
                      t("analytics.alert.rewardedMessage", {
                        period: periodLabel,
                        format: formatLabel,
                      }),
                      [
                        { text: t("common.cancel"), style: "cancel" },
                        {
                          text: t("analytics.alert.rewardedButton"),
                          onPress: () => {
                            showRewardedAd(() => {
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
                            });
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

          {tab === "monthly" && (
            <MonthlyComparison
              data={dataAllTables || []}
              currency={currency || "TRY"}
            />
          )}

          {/* Top 5 Harcamalar */}

          <TopFiveExpenses
            data={dataTransactions || []}
            isLoading={isLoading}
            error={error as Error}
            currency={currency}
          />

          {/* Gelir-Gider KarÅŸÄ±laÅŸtÄ±rmasÄ± */}

          <Pascalcase
            data={dataAllTables || []}
            isLoading={isLoading}
            error={error as Error}
            currency={currency || "TRY"}
          />
          <View style={{ alignItems: "center", marginVertical: hp(2) }}>
            <BannerAd
              unitId={adUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

