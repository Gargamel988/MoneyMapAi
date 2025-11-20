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
                  paddingVertical: dimensions.sm,
                  paddingHorizontal: dimensions.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {/* Icon */}
                  <View
                    style={{
                      backgroundColor: item.categories.color,
                      padding: dimensions.iconSM - 2,
                      borderRadius: dimensions.borderRadiusLG,
                      flexShrink: 0,
                    }}
                  >
                    <Feather
                      name={item.categories.icon as any}
                      size={dimensions.iconMD}
                      color={theme.white}
                    />
                  </View>

                  {/* Orta kısım: kategori bilgileri */}
                  <View
                    style={{
                      flex: 1,
                      minWidth: 0,
                      marginRight: dimensions.xs,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: dimensions.fontLG,
                          fontWeight: "500",
                          color: theme.text,
                          flexShrink: 1,
                          minWidth: 0,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.categories.name}
                      </Text>

                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 99,
                          backgroundColor: theme.lastprocessbackground,
                          flexShrink: 0,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.textSecondary,
                            fontSize: dimensions.fontSM,
                          }}
                          numberOfLines={1}
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
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {formatDayMonth(item.date)} • {formatTime(item.time)}
                    </Text>
                  </View>

                  {/* Sağ kısım: tutar */}
                  <View
                    style={{
                      flexShrink: 0,
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        color: isIncome ? theme.success : theme.error,
                        fontSize: dimensions.fontLG,
                        fontWeight: "500",
                      }}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {isIncome ? "+" : "-"}
                      {formatTotal(Math.abs(item.total_amount), currency)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
          );
        }}
      />
    )}
    </View>
  );
}
