import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useRespons";
import { Transaction, TransactionList } from "../../types/transactıonstype";
import { formatTime } from "../../utils/date";
import { formatTotal } from "../../utils/total";

import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { NoDataErrorComponent } from "../common/error";
import { GreenLoadingComponent } from "../common/loading";

interface LastProcessProps {
  data: TransactionList;
  currency: string;
  isLoading: boolean;
  error: Error;
}
export default function LastProcess({ data, currency, isLoading, error }: LastProcessProps) {
  const { dimensions } = useResponsive();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const locale = useMemo(() => (i18n.language || "tr-TR").replace("_", "-"), [i18n.language]);

  const formatDayMonth = (date: string) =>
    new Date(date).toLocaleString(locale, {
      day: "2-digit",
      month: "long",
    });


  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: dimensions.md,
        paddingTop: dimensions.lg,
      }}
    >
      {/* === Başlık ve Açıklama === */}
      <View
        style={{
          marginBottom: dimensions.lg,
          width: "100%",
          gap: 4,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: dimensions.fontXL,
            fontWeight: "700",
            color: theme.text,
            letterSpacing: 0.3,
          }}
        >
          {t("lastProcess.title")}
        </Text>
        <Text
          style={{
            fontSize: dimensions.fontSM,
            fontWeight: "400",
            color: theme.textSecondary,
            textAlign: "center",
          }}
        >
          {t("lastProcess.description")}
        </Text>
      </View>
      {isLoading ? (
        <GreenLoadingComponent />
      ) : error ? (
        <Text>{error.message}</Text>
      ) : data.length === 0 ? (
        <NoDataErrorComponent
          title={t("lastProcess.noDataTitle")}
          message={t("lastProcess.noDataMessage")}
          icon="info"
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          nestedScrollEnabled={false}
          renderItem={({ item }: { item: Transaction }) => {
            const isIncome = item.type === "gelir";
            const typeLabel = isIncome
              ? t("lastProcess.badge.income")
              : t("lastProcess.badge.expense");

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push(`/(screens)/(stack)/history`)}
                style={{
                  borderRadius: 16,
                  backgroundColor: theme.lastprocessbackground,
                  borderWidth: 1,
                  borderColor: theme.lastprocesborder,
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: dimensions.sm,
                  paddingHorizontal: dimensions.md,
                }}
              >
            {/* Sol kısım: ikon + kategori */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: item.categories.color,
                  padding: dimensions.iconSM - 2,
                  borderRadius: dimensions.borderRadiusLG,
                }}
              >
                <Feather
                  name={item.categories.icon as any}
                  size={dimensions.iconMD}
                  color={theme.white}
                />
              </View>

              <TouchableOpacity
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: item.categories.color,
                      padding: dimensions.iconSM - 2,
                      borderRadius: dimensions.borderRadiusLG,
                    }}
                  >
                    <Feather
                      name={item.categories.icon as any}
                      size={dimensions.iconMD}
                      color={theme.white}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: dimensions.fontLG,
                          fontWeight: "500",
                          color: theme.text,
                        }}
                      >
                        {item.categories.name}
                      </Text>

                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 99,
                          backgroundColor: theme.lastprocessbackground,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.textSecondary,
                            fontSize: dimensions.fontSM,
                          }}
                        >
                          {typeLabel}
                        </Text>
                      </View>
                    </View>


                    <Text
                      style={{
                        color: theme.textSecondary,
                        fontSize: dimensions.fontSM,
                      }}
                    >
                      {formatDayMonth(item.date)} • {formatTime(item.time)}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{
                      color: isIncome ? theme.success : theme.error,
                      fontSize: dimensions.fontLG,
                      fontWeight: "500",
                    }}
                  >
                    {isIncome ? "+" : "-"}
                    {formatTotal(Math.abs(item.total_amount), currency)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            </TouchableOpacity>
          );
        }}
      />
    )}
    </View>
  );
}
