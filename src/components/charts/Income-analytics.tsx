import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SummaryCard } from "../../components/ui/summary-card";
import { hp, isTablet, moderateScale, wp } from "../../hooks/useRespons";
import { Transaction, TransactionList } from "../../types/transactıonstype";
import { hexToRgba } from "../../utils/hextorgba";

import { Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTheme } from "../../../src/contexts/theme";
import InfoCard from "../ui/ınfo-card";

interface IncomeAnalyticsProps {
  transactionsData: TransactionList;
}

export default function IncomeAnalytics({ transactionsData }: IncomeAnalyticsProps) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  const locale = (i18n.language || "tr-TR").replace("_", "-");

  const monthsData = useMemo(() => {
    const now = new Date();
    const baseDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    return Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + index, 1);
      const labelFormatter = new Intl.DateTimeFormat(locale, {
        month: "short",
      });
      const label = labelFormatter.format(monthDate);

      const total = (transactionsData || []).reduce((sum, transaction: Transaction) => {
        if (!transaction || transaction.type !== "gelir" || !transaction.date) {
          return sum;
        }
        const transactionDate = new Date(transaction.date);
        const isSameMonth =
          transactionDate.getFullYear() === monthDate.getFullYear() &&
          transactionDate.getMonth() === monthDate.getMonth();

        if (!isSameMonth) {
          return sum;
        }

        return sum + (transaction.total_amount || 0);
      }, 0);

      return {
        label: label.charAt(0).toUpperCase() + label.slice(1),
        total,
        monthDate,
      };
    });
  }, [transactionsData, locale]);

  const labels = monthsData.map((item) => item.label);
  const monthlyTotals = monthsData.map((item) => item.total || 0);
  const totalIncome = monthlyTotals.reduce((sum, value) => sum + value, 0);
  const incomeValues = monthlyTotals.filter((value) => value > 0);
  const highestIncome = incomeValues.length > 0 ? Math.max(...incomeValues) : 0;
  const lowestIncome = incomeValues.length > 0 ? Math.min(...incomeValues) : 0;
  const highestMonth = monthsData.find((item) => item.total === highestIncome)?.label ?? "";
  const lowestMonth = monthsData.find((item) => item.total === lowestIncome)?.label ?? "";

  const periodFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  });
  const periodStart = periodFormatter.format(monthsData[0]?.monthDate ?? new Date());
  const periodEnd = periodFormatter.format(monthsData[monthsData.length - 1]?.monthDate ?? new Date());

  const chartConfig = {
    backgroundGradientFrom: theme.incomebackgroundFrom,
    backgroundGradientTo: theme.incomebackgroundTo,
    backgroundGradientFromOpacity: 0.8,
    backgroundGradientToOpacity: 0.9,
    color: () => hexToRgba(theme.incomecolor, 0.9),
    labelColor: () => hexToRgba(theme.incomelabelcolor, 0.9),
    strokeWidth: moderateScale(2),
    barPercentage: 0.55,
    decimalPlaces: 0,
    fillShadowGradientOpacity: 1,
    fillShadowGradient: theme.incomecolor,
    propsForLabels: {
      fontSize: moderateScale(12),
      fontWeight: "600",
    },
  } as const;

  return (
    <View style={{ flex: 1, paddingHorizontal: wp(4), paddingTop: hp(2) }}>
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
          {t("incomeAnalytics.title")}
        </Text>
        <Text
          style={{
            fontSize: hp(1.6),
            fontWeight: "500",
            color: theme.textSecondary,
          }}
        >
          {t("incomeAnalytics.period", {
            start: periodStart,
            end: periodEnd,
          })}
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
          {t("incomeAnalytics.description")}
        </Text>
      </View>

      <View style={{ marginBottom: hp(3) }}>
        <BarChart
          data={{
            labels,
            datasets: [
              { data: monthlyTotals },
            ],
          }}
          yAxisLabel=""
          yAxisSuffix=""
          width={isTablet ? wp(78) : wp(92)}
          height={isTablet ? hp(30) : hp(28)}
          chartConfig={chartConfig as any}
          style={{
            borderRadius: 10,
          }}
          showValuesOnTopOfBars
          showBarTops={false}
          withInnerLines={false}
          verticalLabelRotation={0}
          fromZero
          segments={5}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: wp(2),
        }}
      >
        <SummaryCard title={t("incomeAnalytics.cards.total") as string} value={totalIncome} color={theme.summarycardborder} />
        <SummaryCard
          title={t("incomeAnalytics.cards.highest") as string}
          value={highestIncome}
          color={theme.summarycardborderprimary}
          subtitle={highestMonth}
        />
        <SummaryCard
          title={t("incomeAnalytics.cards.lowest") as string}
          value={lowestIncome}
          color={theme.summarycardbordersecondary}
          subtitle={lowestMonth}
        />
      </View>

      <InfoCard>
        {t("incomeAnalytics.tip")}
      </InfoCard>
    </View>
  );
}

