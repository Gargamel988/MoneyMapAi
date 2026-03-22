import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useResponsive";
import { Transaction, TransactionList } from "@/src/types/transactionTypes";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { WeeklyCard } from "../ui/weekly-card";
import InfoCard from "../ui/info-card";

interface FinanceSummaryProps {
  isLoading: boolean;
  error: Error;
  data: TransactionList;
  currency: string;
  tabs?: "daily" | "weekly" | "monthly" | "yearly"; // Analytics'ten gelen period bilgisi
}

export default function FinanceSummary({
  isLoading,
  error,
  data,
  currency,
  tabs,
}: FinanceSummaryProps) {
  const { t } = useTranslation();
  const items = Array.isArray(data) ? data : [];
  const { theme } = useTheme();
  const { wp, hp, isTablet } = useResponsive();

  const incomeTotal = items
    .filter((item: Transaction) => item?.type === "gelir")
    .reduce(
      (acc: number, item: Transaction) => acc + (item?.total_amount || 0),
      0
    );

  const expenseTotal = items
    .filter((item: Transaction) => item?.type === "gider")
    .reduce(
      (acc: number, item: Transaction) => acc + (item?.total_amount || 0),
      0
    );

  const total = incomeTotal - expenseTotal;

  // 💡 Akıllı öneri kısmı
  let insightText = "";
  const diff = incomeTotal - expenseTotal;
  const periodLabel = tabs ? t(`analytics.periods.${tabs}`) : t("analytics.periods.monthly");

  if (incomeTotal === 0 && expenseTotal === 0) {
    insightText = t("financeSummary.insight.noData");
  } else if (diff > 0) {
    const percent = ((diff / incomeTotal) * 100).toFixed(1);
    insightText = t("financeSummary.insight.positive", {
      period: periodLabel,
      percent,
    });
  } else if (diff === 0) {
    insightText = t("financeSummary.insight.balanced", {
      period: periodLabel,
    });
  } else {
    const deficit = ((Math.abs(diff) / incomeTotal) * 100).toFixed(1);
    insightText = t("financeSummary.insight.negative", {
      period: periodLabel,
      deficit,
    });
  }

  return (
    <View
      style={{
        marginHorizontal: isTablet ? wp(8) : wp(6),
        marginTop: hp(2.5),
        gap: hp(1.8),
      }}
    >
      {/* 🧾 Finansal Özet Başlığı */}
      <Text
        style={{
          fontSize: hp(2.2),
          fontWeight: "700",
          color: theme.text,
          marginBottom: hp(0.5),
        }}
      >
        {t("financeSummary.title")}
      </Text>
      <Text
        style={{
          fontSize: hp(1.6),
          color: theme.textSecondary,
          marginBottom: hp(1),
        }}
      >
        {t("financeSummary.description", {
          period: periodLabel,
        })}
      </Text>

      {/* Kartlar */}
      <WeeklyCard
        id="income"
        name={t("financeSummary.cards.totalIncome")}
        value={incomeTotal}
        isLoading={isLoading}
        error={error}
        currency={currency}
      />
      <WeeklyCard
        id="expense"
        name={t("financeSummary.cards.totalExpense")}
        value={expenseTotal}
        isLoading={isLoading}
        error={error}
        currency={currency}
      />
      <WeeklyCard
        id="balance"
        name={t("financeSummary.cards.netBalance")}
        value={total}
        currency={currency}
        isLoading={isLoading}
        error={error}
      />

      {/* 💬 Akıllı Öneri */}
      <InfoCard>
        {`${t("financeSummary.insight.title")}
${insightText}`}
      </InfoCard>
    </View>
  );
}
