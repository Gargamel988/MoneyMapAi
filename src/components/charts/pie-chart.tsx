import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useResponsive";
import { Transaction, TransactionList } from "../../types/transactionTypes";
import { formatTotal } from "../../utils/total";
import { NoDataErrorComponent } from "../common/error";
import { GreenLoadingComponent } from "../common/loading";

type PieChartTabs = "daily" | "weekly" | "monthly" | "yearly";

type PieChartComponentProps = {
  data: TransactionList;
  isLoading: boolean;
  error: Error;
  currency: string;
  tabs: PieChartTabs;
};

interface PieChartData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export default function PieChartComponent({
  data,
  isLoading,
  error,
  currency,
  tabs,
}: PieChartComponentProps) {
  const { hp, wp } = useResponsive();
  const [showCategories, setShowCategories] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const translateY = useRef(new Animated.Value(-200)).current;

  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    color: (opacity = 1) =>
      theme.primary.replace(")", `, ${opacity})`).replace("rgb", "rgba"),
    labelColor: (opacity = 1) =>
      theme.text.replace(")", `, ${opacity})`).replace("rgb", "rgba"),
  };

  const processData = (): PieChartData[] => {
    if (!data) {
      return [
        {
          name: t("pieChart.noDataPlaceholder"),
          amount: 1,
          color: theme.textSecondary,
          legendFontColor: theme.textPrimary,
          legendFontSize: 15,
        },
      ];
    }

    const dataArray: TransactionList = Array.isArray(data) ? data : [];
    const rawArray = dataArray.filter(
      (transaction: Transaction) => transaction.type === "gider"
    );

    const categoryTotals: {
      [key: string]: { amount: number; color: string; name: string };
    } = {};

    rawArray.forEach((transaction: Transaction) => {
      if (!transaction?.categories) {
        console.warn("Transaction categories is undefined:", {
          id: transaction?.id,
          category_id: transaction?.category_id,
          description: transaction?.description,
        });
        return;
      }

      const rawName = transaction.categories?.name;
      const categoryName = rawName 
        ? (rawName.startsWith('categories.default') ? t(rawName) : rawName) 
        : t("pieChart.unknownCategory");
      const amount = Number(transaction?.total_amount) || 0;
      const color = transaction.categories?.color || "#9E9E9E";

      if (categoryTotals[categoryName]) {
        categoryTotals[categoryName].amount += amount;
      } else {
        categoryTotals[categoryName] = { amount, color, name: categoryName };
      }
    });

    return Object.values(categoryTotals).map((category) => ({
      name: category.name,
      amount: category.amount,
      color: category.color,
      legendFontColor: theme.textPrimary,
      legendFontSize: 15,
    }));
  };

  const chartData = processData();
  const total = chartData.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );
  const formattedTotal = formatTotal(total, currency);
  const periodLabel = t(`pieChart.period.${tabs}`);
  const headerText = t("pieChart.header", { period: periodLabel });
  const subtitleText = t("pieChart.subtitle", { period: periodLabel });
  const totalLabel = t("pieChart.total", { amount: formattedTotal });

  const toggleCategories = () => {
    const next = !showCategories;
    setShowCategories(next);
    Animated.timing(translateY, {
      toValue: next ? 0 : -200,
      duration: next ? 300 : 250,
      easing: next ? Easing.out(Easing.back(1.2)) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      if (!next) setShowCategories(false);
    });
  };
  const percentage = (amount: number) => ((amount / total) * 100 || 0).toFixed(2);

  return (
    <View style={{ flex: 1, marginHorizontal: wp(4), marginTop: hp(2) }}>
      <View
        style={{
          width: wp(90),
          alignItems: "center",
          gap: hp(0.3),
          marginBottom: hp(2),
        }}
      >
        <Text
          style={{
            fontSize: hp(2.4),
            fontWeight: "700",
            color: theme.text,
            letterSpacing: 0.3,
          }}
        >
          {headerText}
        </Text>
        <Text
          style={{
            fontSize: hp(1.6),
            fontWeight: "500",
            color: theme.text,
          }}
        >
          {totalLabel}
        </Text>
        <Text
          style={{
            fontSize: hp(1.6),
            fontWeight: "400",
            color: theme.textSecondary,
            lineHeight: hp(2.2),
            marginTop: hp(0.5),
            textAlign: "center",
          }}
        >
          {subtitleText}
        </Text>
      </View>

      {isLoading ? (
        <GreenLoadingComponent />
      ) : error ? (
        <Text>{error.message}</Text>
      ) : chartData.length === 0 ? (
        <NoDataErrorComponent
          title={t("pieChart.noDataTitle")}
          message={t("pieChart.noDataMessage")}
          icon="info"
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleCategories}
          style={{
            paddingVertical: hp(2),
            marginBottom: hp(2),
          }}
        >
          <PieChart
            data={chartData}
            width={wp(80)}
            height={hp(32)}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft={"0"}
            center={[90, 0]}
            hasLegend={false}
          />
        </TouchableOpacity>
      )}


      {/* Kategori Detayları */}
      {showCategories && (
        <Animated.ScrollView
          style={{
            transform: [{ translateY }],
            maxHeight: hp(30),
            marginTop: hp(1)
          }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {chartData.map((item) => (
            <View
              key={item.name}
              style={{
                backgroundColor: theme.cardGlass,
                padding: wp(4),
                borderRadius: wp(3),
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 1.5,
                borderColor: `${item.color}30`, // Soft tint matching category
                borderLeftWidth: wp(1.5),
                borderLeftColor: item.color,
                marginBottom: hp(1),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp(3),
                }}
              >
                <View
                  style={{
                    width: wp(3.5),
                    height: wp(3.5),
                    borderRadius: wp(1.75),
                    backgroundColor: item.color,
                  }}
                />
                <Text
                  style={{
                    color: theme.text,
                    fontSize: wp(3.8),
                    fontWeight: "600",
                  }}
                >
                  {item.name} <Text style={{ color: theme.textSecondary, fontWeight: "500", fontSize: wp(3.5) }}>({percentage(item.amount)}%)</Text>
                </Text>
              </View>
              <Text
                style={{
                  color: theme.text,
                  fontSize: wp(4),
                  fontWeight: "700",
                }}
              >
                {formatTotal(item.amount, currency)}
              </Text>
            </View>
          ))}
        </Animated.ScrollView>
      )}
    </View>
  );
}
