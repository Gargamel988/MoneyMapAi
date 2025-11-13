import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useRespons";
import { Transaction, TransactionList } from "@/src/types/transactıonstype";
import { Text, View } from "react-native";
import { WeeklyCard } from "../ui/weekly-card";
import InfoCard from "../ui/ınfo-card";

interface FinanceSummaryProps {
  isLoading: boolean;
  error: Error;
  data: TransactionList;
  currency: string;
  tabs?: string; // Analytics'ten gelen 'Günlük, Aylık...' bilgisi
}

export default function FinanceSummary({
  isLoading,
  error,
  data,
  currency,
  tabs,
}: FinanceSummaryProps) {
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

  if (incomeTotal === 0 && expenseTotal === 0) {
    insightText =
      "Henüz işlem bulunmuyor. Veri eklendikçe analizler burada görünecek.";
  } else if (diff > 0) {
    const percent = ((diff / incomeTotal) * 100).toFixed(1);
    insightText = `Harika! Bu ${
      tabs?.toLowerCase() || "dönem"
    } gelirlerin giderlerinden %${percent} fazla.`;
  } else if (diff === 0) {
    insightText = `Bu ${
      tabs?.toLowerCase() || "dönem"
    } gelir ve giderlerin dengede.`;
  } else {
    const deficit = ((Math.abs(diff) / incomeTotal) * 100).toFixed(1);
    insightText = `Dikkat! Bu ${
      tabs?.toLowerCase() || "dönem"
    } giderlerin gelirlerinden %${deficit} daha fazla.`;
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
        Finansal Özet
      </Text>
      <Text
        style={{
          fontSize: hp(1.6),
          color: theme.textSecondary,
          marginBottom: hp(1),
        }}
      >
        {tabs} dönemi gelir, gider ve bakiye özeti
      </Text>

      {/* Kartlar */}
      <WeeklyCard
        id="income"
        name="Toplam Gelir"
        value={incomeTotal}
        isLoading={isLoading}
        error={error}
        currency={currency}
      />
      <WeeklyCard
        id="expense"
        name="Toplam Gider"
        value={expenseTotal}
        isLoading={isLoading}
        error={error}
        currency={currency}
      />
      <WeeklyCard
        id="balance"
        name="Net Bakiye"
        value={total}
        currency={currency}
        isLoading={isLoading}
        error={error}
      />

      {/* 💬 Akıllı Öneri */}
      <InfoCard>
        {`💡 Finansal İçgörü:
${insightText}`}
      </InfoCard>
    </View>
  );
}
