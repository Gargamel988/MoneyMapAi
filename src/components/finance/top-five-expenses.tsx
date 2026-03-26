import { Transaction, TransactionList } from "@/src/types/transactionTypes";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useResponsive";
import { Feather } from "@expo/vector-icons";
import { hexToRgba } from "../../utils/hextorgba";
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
      const rawName = item.categories?.name || "";
      const categoryName = rawName.includes("categories.default") 
        ? t(rawName as any) 
        : rawName || t("topFiveExpenses.unknownCategory");

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
    const rawTopCategory = top.categories.name || "";
    const topCategory = rawTopCategory.includes("categories.default")
      ? t(rawTopCategory as any)
      : rawTopCategory || t("topFiveExpenses.category");
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
              const rawName = item.categories?.name || "";
              const categoryName = rawName.includes("categories.default") 
                ? t(rawName as any) 
                : rawName || t("topFiveExpenses.category");
              const categoryColor = item.categories.color || theme.textTertiary;
              const percentage = percentages[index] || 0;

              return (
                <View
                  key={item.id || index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderWidth: 1.5,
                    borderColor: theme.cardBorder,
                    backgroundColor: theme.cardGlass,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        height: 48,
                        width: 48,
                        borderRadius: 14,
                        backgroundColor: hexToRgba(categoryColor, 0.15),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather
                        name={(item.categories?.icon as any) || "shopping-bag"}
                        size={22}
                        color={categoryColor}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          color: theme.text,
                          marginBottom: 4,
                        }}
                      >
                        {categoryName}
                      </Text>
                      <View
                        style={{
                          height: 6,
                          width: 80,
                          backgroundColor: hexToRgba(categoryColor, 0.15),
                          borderRadius: 3,
                        }}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: `${percentage}%`,
                            backgroundColor: categoryColor,
                            borderRadius: 3,
                          }}
                        />
                      </View>
                    </View>
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
                        fontWeight: "700",
                        fontSize: 15,
                        color: theme.text,
                      }}
                    >
                      {formatTotal(item.total_amount, currency)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: categoryColor,
                      }}
                    >
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
