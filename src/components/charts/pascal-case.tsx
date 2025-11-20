import { Transaction, TransactionList } from "@/src/types/transactıonstype";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useRespons";
import { formatTotal } from "../../utils/total";
import { ErrorFallback, NoDataErrorComponent } from "../common/error";
import { GreenLoadingComponent } from "../common/loading";

type PascalcaseProps = {
  data: TransactionList;
  isLoading: boolean;
  error: Error;
  currency: string;
};

const COLORS = {
  success: "#6EE7B7",
  error: "#EF4444",
};

export default function Pascalcase({
  data,
  isLoading,
  error,
  currency,
}: PascalcaseProps) {
  const { t } = useTranslation();
  const { hp, wp, dimensions, moderateScale, isTablet, isPhone } =
    useResponsive();
  const { theme } = useTheme();

  const formatYAxisLabel = React.useCallback((rawValue: string) => {
    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) {
      return "0";
    }

    const absValue = Math.abs(numericValue);
    const abbreviate = (
      value: number,
      divisor: number,
      suffix: string
    ): string => {
      const scaled = value / divisor;
      const formatted =
        Math.abs(scaled) >= 10
          ? scaled.toFixed(0)
          : scaled.toFixed(1).replace(/\.0$/, "");
      return `${formatted}${suffix}`;
    };

    if (absValue >= 1_000_000_000) {
      return abbreviate(numericValue, 1_000_000_000, "B");
    }
    if (absValue >= 1_000_000) {
      return abbreviate(numericValue, 1_000_000, "M");
    }
    if (absValue >= 1_000) {
      return abbreviate(numericValue, 1_000, "K");
    }

    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "transparent",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "transparent",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(74, 127, 167, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(7, 23, 57, ${opacity})`,
    strokeWidth: moderateScale(3),
    barPercentage: 0.5,
    useShadowColorFromDataset: true,
    decimalPlaces: 0,
    style: {
      borderRadius: dimensions.borderRadiusLG,
    },
  };

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  

  const safeData = Array.isArray(data) ? data : [];

  const currentYearTransactions = safeData.filter((item: Transaction) => {
    if (!item.date) return false;
    try {
      const itemYear = new Date(item.date).getFullYear();
      return itemYear === currentYear;
    } catch {
      return false;
    }
  });

  const lastYearTransactions = safeData.filter((item: Transaction) => {
    if (!item.date) return false;
    try {
      const itemYear = new Date(item.date).getFullYear();
      return itemYear === lastYear ;
    } catch {
      return false;
    }
  });


  const getMonthlyData = (transactions: Transaction[], type: "gelir" | "gider") => {
    const monthlyData = new Array(12).fill(0);
    if (!Array.isArray(transactions)) return monthlyData;

    transactions
      .filter((item: Transaction) => item.type === type)
      .forEach((item: Transaction) => {
        if (!item.date) return;
        try {
          const month = new Date(item.date).getMonth();
          if (month >= 0 && month < 12) {
            monthlyData[month] += item.total_amount || 0;
          }
        } catch {
        }
      });

    return monthlyData;
  };

  const currentYearIncome = getMonthlyData(currentYearTransactions, "gelir");
  const currentYearExpense = getMonthlyData(currentYearTransactions, "gider");

  const lastYearIncome = getMonthlyData(lastYearTransactions, "gelir");
  const lastYearExpense = getMonthlyData(lastYearTransactions, "gider");

  const monthLabels = [
    t("pascalCase.months.jan"),
    t("pascalCase.months.feb"),
    t("pascalCase.months.mar"),
    t("pascalCase.months.apr"),
    t("pascalCase.months.may"),
    t("pascalCase.months.jun"),
    t("pascalCase.months.jul"),
    t("pascalCase.months.aug"),
    t("pascalCase.months.sep"),
    t("pascalCase.months.oct"),
    t("pascalCase.months.nov"),
    t("pascalCase.months.dec"),
  ];

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        data: currentYearIncome.map((amount) => (amount || 0) ),
        label: t("pascalCase.currentYearIncome", { year: currentYear }),
        formatYLabel: (value: number) => {
          return value;
        },

        color: (opacity = 1) => `rgba(110, 231, 183, ${opacity})`,
        strokeWidth: moderateScale(3),
      },
      {
        data: lastYearIncome.map((amount) => (amount || 0) ),
        label: t("pascalCase.lastYearIncome", { year: lastYear }),
        formatYLabel: (value: number) => {
          return formatTotal(value, currency);
        },
        color: (opacity = 1) => `rgba(108, 144, 195, ${opacity})`,
        strokeWidth: moderateScale(2),
      },
      {
        data: currentYearExpense.map((amount) => (amount || 0) ),
        label: t("pascalCase.currentYearExpense", { year: currentYear }),
        formatYLabel: (value: number) => {
          return formatTotal(value, currency);
        },
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: moderateScale(3),
      },
      {
        data: lastYearExpense.map((amount) => (amount || 0) ),
        label: t("pascalCase.lastYearExpense", { year: lastYear }),
        formatYLabel: (value: number) => {
          return formatTotal(value, currency);
        },
        color: (opacity = 1) => `rgba(249, 220, 92, ${opacity})`,
        strokeWidth: moderateScale(2),
      },
    ],
  };

  const currentYearTotalIncome = currentYearIncome.reduce(
    (sum, amount) => sum + (amount || 0),
    0
  );
  const currentYearTotalExpense = currentYearExpense.reduce(
    (sum, amount) => sum + (amount || 0),
    0
  );
  const lastYearTotalIncome = lastYearIncome.reduce(
    (sum, amount) => sum + (amount || 0),
    0
  );
  const lastYearTotalExpense = lastYearExpense.reduce(
    (sum, amount) => sum + (amount || 0),
    0
  );
  const hasData = safeData.length > 0;

  // Yıllık büyüme oranı hesaplama
  const incomeGrowth = lastYearTotalIncome > 0 
    ? ((currentYearTotalIncome - lastYearTotalIncome) / lastYearTotalIncome) * 100 
    : 0;
  const expenseGrowth = lastYearTotalExpense > 0 
    ? ((currentYearTotalExpense - lastYearTotalExpense) / lastYearTotalExpense) * 100 
    : 0;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          padding: isTablet ? dimensions.lg : dimensions.md,
        }}
      >
        {isLoading ? (
          <GreenLoadingComponent text={t("pascalCase.loading")} />
        ) : !hasData ? (
          <NoDataErrorComponent
            title={t("pascalCase.noData.title")}
            message={t("pascalCase.noData.message")}
            icon="inbox"
          />
        ) : error ? (
          <ErrorFallback error={error} />
        ) : (
          <>
            {/* Başlık Bölümü */}
            <View
              style={{
                marginBottom: hp(2),
                padding: isTablet ? dimensions.lg : dimensions.md,
              }}
            >
              <Text
                style={{
                  fontSize: isTablet ? moderateScale(24) : moderateScale(20),
                  fontWeight: "700",
                  color: theme.text,
                  textAlign: "center",
                  marginBottom: dimensions.xs,
                }}
              >
                {t("pascalCase.title")}
              </Text>
              <Text
                style={{
                  fontSize: dimensions.fontSM,
                  color: theme.textSecondary,
                  textAlign: "center",
                  lineHeight: moderateScale(20),
                }}
              >
                {t("pascalCase.description", {
                  currentYear,
                  lastYear,
                })}
              </Text>
            </View>

            {/* Özet Kartları */}
            <View
              style={{
                flexDirection: "row",
                gap: dimensions.md,
                marginBottom: hp(2),
              }}
            >
              {/* Gelir Artışı */}
              <View
                style={{
                  flex: 1,
                  padding: dimensions.md,
                  borderRadius: dimensions.borderRadiusLG,
                  backgroundColor: theme.white,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <Text
                  style={{
                    fontSize: dimensions.fontXS,
                    color: theme.textQuaternary,
                    marginBottom: dimensions.xs,
                  }}
                >
                  {t("pascalCase.incomeChange")}
                </Text>
                <Text
                  style={{
                    fontSize: isTablet ? dimensions.fontXL : dimensions.fontLG,
                    fontWeight: "700",
                    color: incomeGrowth >= 0 ? theme.success : theme.error,
                  }}
                >
                  {incomeGrowth >= 0 ? "↑" : "↓"} {Math.abs(incomeGrowth).toFixed(1)}%
                </Text>
              </View>

              {/* Gider Değişimi */}
              <View
                style={{
                  flex: 1,
                  padding: dimensions.md,
                  borderRadius: dimensions.borderRadiusLG,
                  backgroundColor: theme.white,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <Text
                  style={{
                    fontSize: dimensions.fontXS,
                    color: theme.textQuaternary,
                    marginBottom: dimensions.xs,
                  }}
                >
                  {t("pascalCase.expenseChange")}
                </Text>
                <Text
                  style={{
                    fontSize: isTablet ? dimensions.fontXL : dimensions.fontLG,
                    fontWeight: "700",
                    color: expenseGrowth >= 0 ? theme.error : theme.success,
                  }}
                >
                  {expenseGrowth >= 0 ? "↑" : "↓"} {Math.abs(expenseGrowth).toFixed(1)}%
                </Text>
              </View>
            </View>

            {/* Grafik Kartı */}
            <View
              style={{
                marginBottom: hp(1.5),
                borderRadius: dimensions.borderRadiusXL,
                padding: isTablet ? dimensions.lg : dimensions.md,
                backgroundColor: theme.white,
                borderWidth: 1,
                borderColor: theme.border,
                shadowColor: theme.shadow,
                shadowOpacity: 0.15,
                shadowRadius: moderateScale(6),
                shadowOffset: {
                  width: 0,
                  height: moderateScale(3),
                },
              }}
            >
              <Text
                style={{
                  marginBottom: dimensions.xs,
                  textAlign: "center",
                  fontSize: isTablet ? dimensions.fontXXL : dimensions.fontXL,
                  fontWeight: "600",
                  color: theme.inputtitle,
                }}
              >
                {t("pascalCase.chartTitle")}
              </Text>
          

              <LineChart
                data={chartData }
                width={isTablet ? wp(84) : wp(87)}
                height={isTablet ? moderateScale(280) : moderateScale(250)}
                formatYLabel={formatYAxisLabel}
                yAxisLabel={
                  currency === "TRY"
                    ? "₺"
                    : currency === "USD"
                    ? "$"
                    : currency === "EUR"
                    ? "€"
                    : currency === "GBP"
                    ? "£"
                    : currency === "JPY"
                    ? "¥"
                    : currency === "CNY"
                    ? "¥"
                    : ""
                }
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={chartConfig as any}
                bezier
                style={{
                  marginVertical: dimensions.sm,
                  borderRadius: dimensions.borderRadiusLG,
                  paddingRight: isTablet
                    ? moderateScale(50)
                    : moderateScale(43.5),
                }}
                withInnerLines={true}
                withOuterLines={true}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                segments={5}
              />

              {/* Legend - Açıklama */}
              <Text
                style={{
                  fontSize: dimensions.fontXS,
                  fontWeight: "600",
                  color: theme.textQuaternary,
                  textAlign: "center",
                  marginTop: dimensions.sm,
                  marginBottom: dimensions.xs,
                }}
              >
                {t("pascalCase.legendTitle")}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isTablet ? dimensions.lg : dimensions.md,
                  flexWrap: isPhone ? "wrap" : "nowrap",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    gap: dimensions.xs,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        marginRight: dimensions.sm,
                        height: moderateScale(8),
                        width: moderateScale(16),
                        borderRadius: dimensions.xs,
                        backgroundColor: "#6EE7B7",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: dimensions.fontSM,
                        fontWeight: "600",
                        color: "#6EE7B7",
                      }}
                    >
                      {t("pascalCase.currentYearIncome", { year: currentYear })}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        marginRight: dimensions.sm,
                        height: moderateScale(8),
                        width: moderateScale(16),
                        borderRadius: dimensions.xs,
                        backgroundColor: "#EF4444",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: dimensions.fontSM,
                        fontWeight: "600",
                        color: "#EF4444",
                      }}
                    >
                      {t("pascalCase.currentYearExpense", { year: currentYear })}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    gap: dimensions.xs,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        marginRight: dimensions.sm,
                        height: moderateScale(8),
                        width: moderateScale(16),
                        borderRadius: dimensions.xs,
                        backgroundColor: "#6C90C3",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: dimensions.fontSM,
                        fontWeight: "600",
                        color: "#6C90C3",
                      }}
                    >
                      {t("pascalCase.lastYearIncome", { year: lastYear })}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        marginRight: dimensions.sm,
                        height: moderateScale(8),
                        width: moderateScale(16),
                        borderRadius: dimensions.xs,
                        backgroundColor: "#F9DC5C",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: dimensions.fontSM,
                        fontWeight: "600",
                        color: "#F9DC5C",
                      }}
                    >
                      {t("pascalCase.lastYearExpense", { year: lastYear })}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Net Kar/Zarar Başlığı */}
            <View
              style={{
                marginBottom: hp(1),
                padding: dimensions.sm,
                borderLeftWidth: moderateScale(4),
                borderLeftColor: theme.summarycardborderprimary,
                backgroundColor: theme.cluebackground,
                borderRadius: dimensions.borderRadius,
              }}
            >
              <Text
                style={{
                  fontSize: dimensions.fontLG,
                  fontWeight: "600",
                  color: theme.text,
                }}
              >
                {t("pascalCase.netProfitLoss.title")}
              </Text>
              <Text
                style={{
                  fontSize: dimensions.fontXS,
                  color: theme.textSecondary,
                  marginTop: dimensions.xs,
                }}
              >
                {t("pascalCase.netProfitLoss.description")}
              </Text>
            </View>

            {/* Net Kar/Zarar Kartı */}
            <View
              style={{
                marginBottom: hp(1.5),
                borderRadius: dimensions.borderRadiusXL,
                padding: isTablet ? dimensions.lg : dimensions.md,
                backgroundColor: theme.white,
                borderWidth: 1,
                borderColor: theme.border,
                shadowColor: theme.shadow,
                shadowOpacity: 0.12,
                shadowRadius: moderateScale(6),
                shadowOffset: { width: 0, height: moderateScale(3) },
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: dimensions.md,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: dimensions.fontSM,
                      fontWeight: "600",
                      color: theme.textQuaternary,
                      marginBottom: dimensions.xs,
                    }}
                  >
                    {currentYear}
                  </Text>
                  <Text
                    style={{
                      fontSize: isTablet
                        ? dimensions.fontXXL
                        : dimensions.fontXL,
                      fontWeight: "bold",
                      color:
                        currentYearTotalIncome - currentYearTotalExpense >= 0
                          ? theme.success
                          : theme.error,
                    }}
                  >
                    {formatTotal(
                      currentYearTotalIncome - currentYearTotalExpense,
                      currency
                    )}
                  </Text>
                  <Text
                    style={{
                      fontSize: dimensions.fontXS,
                      color: theme.textQuaternary,
                      marginTop: dimensions.xs,
                    }}
                  >
                    {currentYearTotalIncome - currentYearTotalExpense >= 0
                      ? t("pascalCase.profit")
                      : t("pascalCase.loss")}
                  </Text>
                </View>

                <View
                  style={{
                    width: 1,
                    backgroundColor: theme.border,
                  }}
                />

                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      fontSize: dimensions.fontSM,
                      fontWeight: "600",
                      color: theme.textQuaternary,
                      marginBottom: dimensions.xs,
                    }}
                  >
                    {lastYear}
                  </Text>
                  <Text
                    style={{
                      fontSize: isTablet
                        ? dimensions.fontXXL
                        : dimensions.fontXL,
                      fontWeight: "bold",
                      color:
                        lastYearTotalIncome - lastYearTotalExpense >= 0
                          ? theme.success
                          : theme.error,
                    }}
                  >
                    {formatTotal(
                      lastYearTotalIncome - lastYearTotalExpense,
                      currency
                    )}
                  </Text>
                  <Text
                    style={{
                      fontSize: dimensions.fontXS,
                      color: theme.textQuaternary,
                      marginTop: dimensions.xs,
                    }}
                  >
                    {lastYearTotalIncome - lastYearTotalExpense >= 0
                      ? t("pascalCase.profit")
                      : t("pascalCase.loss")}
                  </Text>
                </View>
              </View>
            </View>

            {/* Aylık Detaylar Başlığı */}
            <View
              style={{
                marginBottom: hp(1),
                padding: dimensions.sm,
                borderLeftWidth: moderateScale(4),
                borderLeftColor: theme.summarycardborderprimary,
                backgroundColor: theme.cluebackground,
                borderRadius: dimensions.borderRadius,
              }}
            >
              <Text
                style={{
                  fontSize: dimensions.fontLG,
                  fontWeight: "600",
                  color: theme.text,
                }}
              >
                {t("pascalCase.monthlyDetails.title")}
              </Text>
              <Text
                style={{
                  fontSize: dimensions.fontXS,
                  color: theme.textSecondary,
                  marginTop: dimensions.xs,
                }}
              >
                {t("pascalCase.monthlyDetails.description")}
              </Text>
            </View>

            {/* Aylık Trend Kartları */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  maxHeight: hp(47),
                  backgroundColor: "transparent",
                }}
                contentContainerStyle={{
                  padding: isTablet ? dimensions.lg : dimensions.md,
                  paddingVertical: hp(1.5),
                }}
                nestedScrollEnabled={true}
              >
                {chartData.labels.map((month, index) => {
                  const currentIncome = currentYearIncome[index] || 0;
                  const lastIncome = lastYearIncome[index] || 0;
                  const currentExpense = currentYearExpense[index] || 0;
                  const lastExpense = lastYearExpense[index] || 0;

                  const currentNet = currentIncome - currentExpense;
                  const lastNet = lastIncome - lastExpense;

                  return (
                    <View
                      key={index}
                      style={{
                        marginBottom: dimensions.sm,
                        borderRadius: dimensions.borderRadius,
                        padding: isTablet ? dimensions.sm : wp(3),
                        shadowColor: theme.shadow,
                        shadowOpacity: 0.1,
                        shadowRadius: moderateScale(6),
                        shadowOffset: {
                          width: 0,
                          height: moderateScale(2),
                        },
                        borderWidth: 1,
                        borderColor: theme.border,
                        backgroundColor: theme.white,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: dimensions.sm,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: dimensions.fontMD,
                            fontWeight: "700",
                            color: theme.inputtitle,
                          }}
                        >
                          {month}
                        </Text>
                        <View
                          style={{
                            paddingHorizontal: dimensions.sm,
                            paddingVertical: dimensions.xs / 2,
                            borderRadius: dimensions.xs,
                            backgroundColor: theme.cluebackground,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: dimensions.fontXS,
                              color: theme.textQuaternary,
                              fontWeight: "600",
                            }}
                          >
                            {currentYear} / {lastYear}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: dimensions.xs / 2,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: dimensions.fontXS,
                                color: theme.textQuaternary,
                                marginRight: dimensions.xs,
                              }}
                            >
                              {t("pascalCase.monthlyDetails.income")}
                            </Text>
                            <Text
                              style={{
                                fontSize: dimensions.fontSM,
                                color: theme.success,
                                fontWeight: "600",
                              }}
                            >
                              {formatTotal(currentIncome, currency)}
                            </Text>
                            <Text
                              style={{
                                fontSize: dimensions.fontXS,
                                color: theme.textQuaternary,
                                marginHorizontal: dimensions.xs / 2,
                              }}
                            >
                              /
                            </Text>
                            <Text
                              style={{
                                fontSize: dimensions.fontSM,
                                color: theme.textQuaternary,
                              }}
                            >
                              {formatTotal(lastIncome, currency)}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: dimensions.xs / 2,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: dimensions.fontXS,
                                color: theme.textQuaternary,
                                marginRight: dimensions.xs,
                              }}
                            >
                              {t("pascalCase.monthlyDetails.expense")}
                            </Text>
                            <Text
                              style={{
                                fontSize: dimensions.fontSM,
                                color: theme.error,
                                fontWeight: "600",
                              }}
                            >
                              {formatTotal(currentExpense, currency)}
                            </Text>
                            <Text
                              style={{
                                fontSize: dimensions.fontXS,
                                color: theme.textQuaternary,
                                marginHorizontal: dimensions.xs / 2,
                              }}
                            >
                              /
                            </Text>
                            <Text
                              style={{
                                fontSize: dimensions.fontSM,
                                color: theme.textQuaternary,
                              }}
                            >
                              {formatTotal(lastExpense, currency)}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingTop: dimensions.xs,
                              borderTopWidth: 1,
                              borderTopColor: theme.border,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: dimensions.fontXS,
                                color: theme.textQuaternary,
                                marginRight: dimensions.xs,
                              }}
                            >
                              {t("pascalCase.monthlyDetails.net")}
                            </Text>
                            <Text
                              style={{
                                fontSize: dimensions.fontSM,
                                fontWeight: "700",
                                color:
                                  currentNet >= 0 ? COLORS.success : COLORS.error,
                              }}
                            >
                              {formatTotal(currentNet, currency)}
                            </Text>
                            <Text
                              style={{
                                fontSize: dimensions.fontXS,
                                color: theme.textQuaternary,
                                marginHorizontal: dimensions.xs / 2,
                              }}
                            >
                              /
                            </Text>
                            <Text
                              style={{
                                fontSize: dimensions.fontSM,
                                fontWeight: "600",
                                color:
                                  lastNet >= 0 ? theme.textQuaternary : theme.textQuaternary,
                              }}
                            >
                              {formatTotal(lastNet, currency)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}