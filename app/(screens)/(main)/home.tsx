import Feather from "@expo/vector-icons/Feather";
import { useQueries } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../src/contexts/theme";
import { useResponsive } from "../../../src/hooks/useRespons";
import { getCurrency } from "../../../src/lib/profil";
import { transactionsApi } from "../../../src/lib/transactions";
import { TransactionList } from "../../../src/types/transactıonstype";

//components
import IncomeAnalytics from "../../../src/components/charts/Income-analytics";
import Piechart from "../../../src/components/charts/pie-chart";
import Headers from "../../../src/components/common/header";
import Lastprocess from "../../../src/components/finance/last-process";
import WeeklySummary from "../../../src/components/finance/weekly-summary";

export default function Home() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { theme } = useTheme();
  const { dimensions, hp, wp } = useResponsive();
  const { t } = useTranslation();

  const [
    transactionsByLastprocess,
    currencydata,
    twoweeksAgoData,
    yearsincome,
    piechartData,
  ] = useQueries({
    queries: [
      {
        queryKey: ["transactionsByLastprocess"],
        queryFn: transactionsApi.getTransactionsByLastprocess,
      },
      { queryKey: ["currency"], queryFn: getCurrency },
      {
        queryKey: ["twoweeksAgoData"],
        queryFn: transactionsApi.getTransactionsByTwoWeeksAgo,
      },
      { queryKey: ["yearsincome"], queryFn: transactionsApi.getTransactionsByLastSixMonths },
      { queryKey: ["piechartData"], queryFn: transactionsApi.getTransactionsByDay },
    ],
  });
  const currency = currencydata.data?.currency;

  const addTransaction = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: hp(2.5),
          right: wp(5),
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{
            borderRadius: 50,
            padding: hp(2),
            backgroundColor: theme.primary,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
          onPress={() => router.push("/add-transactionscreen")}
        >
          <Feather name="plus" size={dimensions.iconLG} color={theme.white} />
        </TouchableOpacity>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      transactionsByLastprocess.refetch(),
      twoweeksAgoData.refetch(),
      piechartData.refetch(),
      yearsincome.refetch(),
      currencydata.refetch(),
    ]);
    setRefreshing(false);
  };

  const sections = [
    { id: 'weekly', component: WeeklySummary },
    { id: 'ai-promo-1', component: 'AIPromo1' },
    { id: 'pie', component: Piechart },
    { id: 'income', component: IncomeAnalytics },
    { id: 'lastprocess', component: Lastprocess },
  ];

  const renderItem = ({ item }: { item: typeof sections[0] }) => {
    switch (item.id) {
      case 'ai-promo-1':
        return (
          <View
            style={{
              marginHorizontal: wp(4),
              marginVertical: hp(1),
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: 12,
              padding: hp(1.5),
              borderWidth: 1,
              borderColor: 'rgba(99, 102, 241, 0.2)',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, marginRight: 8 }}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: 2,
                  }}
                >
                  {t("home.aiPromo.title")}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.textSecondary,
                  }}
                >
                  {t("home.aiPromo.description")}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/ai-chat")}
                style={{
                  backgroundColor: theme.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 11,
                    fontWeight: '600',
                  }}
                >
                  {t("home.aiPromo.button")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    
      case 'weekly':
        return (
          <WeeklySummary
            data={twoweeksAgoData.data as TransactionList}
            isLoading={twoweeksAgoData.isLoading as boolean}
            error={twoweeksAgoData.error as Error}
            currency={currency}
          />
        );
      case 'pie':
        return (
          <Piechart
            data={piechartData.data as TransactionList}
            isLoading={piechartData.isLoading as boolean}
            error={piechartData.error as Error}
            currency={currency}
            tabs="daily"
          />
        );
      case 'income':
        return (
          <IncomeAnalytics
            transactionsData={yearsincome.data as TransactionList}
            currency={currency}
          />
        );
      case 'lastprocess':
        return (
          <Lastprocess
            data={transactionsByLastprocess.data?.transactions as TransactionList}
            isLoading={transactionsByLastprocess.isLoading as boolean}
            error={transactionsByLastprocess.error as Error}
            currency={currency}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Headers />
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: hp(2) }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {addTransaction()}
    </SafeAreaView>
  );
}