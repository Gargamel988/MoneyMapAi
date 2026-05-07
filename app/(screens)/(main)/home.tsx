import { AdEventType, BannerAd, BannerAdSize, InterstitialAd, TestIds } from "@/src/lib/adComponents";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useQueries } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoalCard } from "../../../src/components/finance/goal-card";
import { QUERY_KEYS } from "../../../src/constants/queryKeys";
import { useTheme } from "../../../src/contexts/theme";
import { useAdvisor } from "../../../src/hooks/useAdvisor";
import { useGoals } from "../../../src/hooks/useGoals";
import { useResponsive } from "../../../src/hooks/useResponsive";
import { getCurrency } from "../../../src/lib/profile";
import { transactionsApi } from "../../../src/lib/transactions";
import { TransactionList } from "../../../src/types/transactionTypes";

//components
import IncomeAnalytics from "../../../src/components/charts/Income-analytics";
import Piechart from "../../../src/components/charts/pie-chart";
import Headers from "../../../src/components/common/header";
import Lastprocess from "../../../src/components/finance/last-process";
import WeeklySummary from "../../../src/components/finance/weekly-summary";

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : (process.env.EXPO_PUBLIC_BANNER_AD_UNIT_ID || TestIds.ADAPTIVE_BANNER);
const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : (process.env.EXPO_PUBLIC_INTERSTITIAL_AD_UNIT_ID || TestIds.INTERSTITIAL);

const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  keywords: ["finance", "savings", "money"],
});

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { theme } = useTheme();
  const { dimensions, wp, hp } = useResponsive();
  const { t } = useTranslation();
  const { data: advisorAdvice, isLoading: isAdvisorLoading } = useAdvisor();
  const { goals, isLoading: isGoalsLoading } = useGoals();

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    });
    interstitial.load();
    return unsubscribe;
  }, []);

  const [
    transactionsByLastprocess,
    currencydata,
    twoweeksAgoData,
    yearsincome,
    piechartData,
  ] = useQueries({
    queries: [
      {
        queryKey: QUERY_KEYS.transactions.lastProcess(),
        queryFn: transactionsApi.getRecentTransactions,
      },
      { queryKey: QUERY_KEYS.user.currency(), queryFn: getCurrency },
      {
        queryKey: QUERY_KEYS.transactions.byPeriod("two-weeks"),
        queryFn: transactionsApi.getTransactionsByTwoWeeksAgo,
      },
      { queryKey: QUERY_KEYS.transactions.byPeriod("six-months"), queryFn: transactionsApi.getTransactionsByLastSixMonths },
      { queryKey: QUERY_KEYS.transactions.byPeriod("daily"), queryFn: transactionsApi.getTransactionsByDay },
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
    { id: 'banner', component: 'Banner' },
    { id: 'debts-promo', component: 'DebtsPromo' },
    { id: 'goals', component: 'Goals' },
    { id: 'ai-advisor', component: 'AIAdvisor' },
    { id: 'pie', component: Piechart },
    { id: 'income', component: IncomeAnalytics },
    { id: 'banner_bottom', component: 'Banner' },
    { id: 'lastprocess', component: Lastprocess },
  ];

  const renderItem = ({ item, index }: { item: typeof sections[0], index: number }) => {
    const content = (() => {
      switch (item.id) {
        case 'banner':
        case 'banner_bottom':
          return (
            <View style={{ alignItems: "center", marginVertical: hp(1) }}>
              <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true,
                }}
              />
            </View>
          );
        case 'goals':
          return goals && goals.length > 0 ? (
            <View style={{ paddingHorizontal: wp(4), marginVertical: hp(1) }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text }}>
                  {t('home.goals.title')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(screens)/(stack)/goals')}>
                  <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 12 }}>{t('common.viewAll')}</Text>
                </TouchableOpacity>
              </View>
              <GoalCard goal={goals[0]} />
            </View>
          ) : null;
        case 'debts-promo':
          return (
            <TouchableOpacity
              onPress={() => router.push("/(screens)/(stack)/debts")}
              style={{
                marginHorizontal: wp(4),
                marginVertical: hp(1),
                backgroundColor: theme.cardGlass,
                borderRadius: 16,
                padding: hp(1.5),
                borderWidth: 1,
                borderColor: theme.cardBorder,
                flexDirection: 'row',
                alignItems: 'center',
                gap: wp(3)
              }}
            >
              <View style={{ backgroundColor: theme.primary + '20', padding: 10, borderRadius: 12 }}>
                <MaterialCommunityIcons name="handshake-outline" size={28} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14 }}>Borç Takibi</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Kime ne kadar borcun var, kimden alacağın var takip et.</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textTertiary} />
            </TouchableOpacity>
          );
        case 'ai-advisor':
          return (
            <View
              style={{
                marginHorizontal: wp(4),
                marginVertical: hp(1),
                backgroundColor: theme.cardGlass,
                borderRadius: 16,
                padding: hp(1.5),
                borderWidth: 1,
                borderColor: theme.cardBorder,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(2) }}>
                <MaterialCommunityIcons name="robot-happy-outline" size={dimensions.iconLG} color={theme.text} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: theme.text,
                      marginBottom: 2,
                    }}
                  >
                    {t("home.advisorPromo.title")}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 12,
                      color: theme.textSecondary,
                    }}
                  >
                    {isAdvisorLoading
                      ? t("home.advisorPromo.loading")
                      : (advisorAdvice?.summary || t("home.advisorPromo.description"))}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const navigate = () => router.push("/(screens)/(stack)/ai-advisor");
                    if (interstitial.loaded) {
                      const unsubscribe = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
                        unsubscribe();
                        interstitial.load();
                        navigate();
                      });
                      interstitial.show();
                    } else {
                      interstitial.load();
                      navigate();
                    }
                  }}
                  style={{
                    backgroundColor: theme.primary,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                >
                  <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
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
    })();

    if (!content) return null;

    return (
      <Animated.View entering={FadeInDown.delay(index * 100).duration(600).springify()}>
        {content}
      </Animated.View>
    );
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
