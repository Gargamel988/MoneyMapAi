import { Transaction, TransactionList } from "@/src/types/transactionTypes";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useResponsive";
import { formatTotal } from "../../utils/total";
import { ErrorFallback, NoDataErrorComponent } from "../common/error";
import { GreenLoadingComponent } from "../common/loading";
import InfoCard from "../ui/info-card";

type TopFiveExpensesProps = {
  data: TransactionList;
  isLoading: boolean;
  error: Error;
  currency: string;
};

export default function TopFiveExpenses({
  data,
  isLoading,
  error,
  currency,
}: TopFiveExpensesProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions } = useResponsive();

  // --- Data Hazırlığı ---
  const dataArray = Array.isArray(data) ? data : [];
  const dataArrayFilter = dataArray.filter(
    (item: Transaction) => item?.type === "gider"
  );

  const total = dataArrayFilter.reduce(
    (sum: number, item: Transaction) => sum + (item?.total_amount || 0), 
    0
  )||0;

  const mergedByCategory = dataArrayFilter.reduce(
    (acc: { [key: string]: Transaction }, item: Transaction) => {
      const categoryName = item.categories?.name || t("topFiveExpenses.unknownCategory");

      if (!acc[categoryName]) {
        acc[categoryName] = { ...item, total_amount: item.total_amount || 0 };
      } else {
        acc[categoryName].total_amount += item.total_amount || 0;
      }
      return acc;
    },
    {}
  );

  const mergedArray = Object.values(mergedByCategory) || [];
  const sortedArray = [...mergedArray].sort(
    (a: Transaction, b: Transaction) =>
      (b.total_amount || 0) - (a.total_amount || 0)
  );
  const max5 = sortedArray.slice(0, 5);

  const percentages =
    max5?.length > 0
      ? max5.map((item: Transaction) =>
          total > 0 ? ((item.total_amount || 0) / total) * 100 : 0
        )
      : [];

  // --- Basit Öngörü (Insight) Hesabı ---
  let insightMessage = "";
  if (max5.length > 0) {
    const top = max5[0];
    const topCategory = top.categories.name;
    const topPercentage = percentages[0] || 0;

    if (topPercentage > 50) {
      insightMessage = t("topFiveExpenses.insight.high", {
        category: topCategory,
      });
    } else if (topPercentage > 30) {
      insightMessage = t("topFiveExpenses.insight.medium", {
        category: topCategory,
      });
    } else if (topPercentage < 15) {
      insightMessage = t("topFiveExpenses.insight.balanced");
    } else {
      insightMessage = t("topFiveExpenses.insight.normal", {
        category: topCategory,
      });
    }
  }

  // --- Render ---
  return (
    <>
      {isLoading ? (
        <GreenLoadingComponent text={t("topFiveExpenses.loading")} />
      ) : error ? (
        <ErrorFallback error={error as Error} />
      ) : !max5?.length ? (
        <NoDataErrorComponent
          title={t("topFiveExpenses.noData.title")}
          message={t("topFiveExpenses.noData.message")}
          icon="inbox"
        />
      ) : (
        <View style={{ flex: 1, padding: dimensions.md }}>
          {/* Başlık */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              color: theme.text,
               textAlign: "center",
            }}
          >
            {t("topFiveExpenses.title")}
          </Text>

          {/* Liste */}
          <View style={{ gap: 8 }}>
            {max5.map((item: Transaction, index: number) => {
              const categoryName = item.categories.name || t("topFiveExpenses.category");
              const categoryColor = item.categories.color || theme.textTertiary;
              const percentage = percentages[index] || 0;

              return (
                <View
                  key={item.id || index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    backgroundColor: theme.white,
                    shadowColor: theme.border,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        height: 8,
                        width: 8,
                        borderRadius: 4,
                        backgroundColor: categoryColor,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: theme.textQuaternary,
                      }}
                    >
                      {categoryName}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 14,
                        color: theme.inputtitle,
                      }}
                    >
                      {formatTotal(item.total_amount, currency)}
                    </Text>
                    <Text style={{ fontSize: 13, color: theme.textQuaternary }}>
                      {percentage.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Öngörü Bölümü */}
      
            <InfoCard>
              {`${t("topFiveExpenses.insight.title")}
${insightMessage}`}
            </InfoCard>
        </View>
      )}
    </>
  );
}
