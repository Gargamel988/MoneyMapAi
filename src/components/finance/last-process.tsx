import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useRespons";
import { Transaction, TransactionList } from "@/src/types/transactıonstype";
import { formatTime } from "@/src/utils/date";
import { formatTotal } from "@/src/utils/total";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
<<<<<<< HEAD
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
=======
import React from "react";
>>>>>>> 2742bcc (ilk yükleme)
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { NoDataErrorComponent } from "../common/error";
import { GreenLoadingComponent } from "../common/loading";

interface LastProcessProps {
  data: TransactionList;
  currency: string;
  isLoading: boolean;
  error: Error;
}
<<<<<<< HEAD
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
=======
export default function LastProcess( { data, currency, isLoading, error }: LastProcessProps ) {
  const { dimensions } = useResponsive();
  const { theme } = useTheme();
  const formatdaymounth = (date: string) => {
    return new Date(date).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "long",
    });
  };


>>>>>>> 2742bcc (ilk yükleme)

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: dimensions.md,
        paddingTop: dimensions.lg,
      }}
    >
<<<<<<< HEAD
=======
      {/* === Başlık ve Açıklama === */}
>>>>>>> 2742bcc (ilk yükleme)
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
<<<<<<< HEAD
          {t("lastProcess.title")}
=======
          💰 Son İşlemler
>>>>>>> 2742bcc (ilk yükleme)
        </Text>
        <Text
          style={{
            fontSize: dimensions.fontSM,
            fontWeight: "400",
            color: theme.textSecondary,
            textAlign: "center",
          }}
        >
<<<<<<< HEAD
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
=======
          Son yapılan gelir ve gider hareketlerinizi buradan takip edebilirsiniz.
        </Text>
      </View>
    {isLoading ? (
        <GreenLoadingComponent />
      ) : error ? (
        <Text>{error.message}</Text>
      ) : 
      data.length === 0 ? (
      <NoDataErrorComponent
      title="Henüz işlem yapılmadı."
      message="İşlemlerinizi ekleyebilirsiniz."
      icon="info"
      

      />
>>>>>>> 2742bcc (ilk yükleme)
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          nestedScrollEnabled={false}
<<<<<<< HEAD
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
=======
          renderItem={({ item }: { item: Transaction }) => (
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

              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
>>>>>>> 2742bcc (ilk yükleme)
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
<<<<<<< HEAD
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

=======
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
>>>>>>> 2742bcc (ilk yükleme)
                    <Text
                      style={{
                        color: theme.textSecondary,
                        fontSize: dimensions.fontSM,
                      }}
                    >
<<<<<<< HEAD
                      {formatDayMonth(item.date)} • {formatTime(item.time)}
=======
                      {item.type}
>>>>>>> 2742bcc (ilk yükleme)
                    </Text>
                  </View>
                </View>

<<<<<<< HEAD
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
            );
          }}
        />
=======
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: dimensions.fontSM,
                  }}
                >
                  {formatdaymounth(item.date)} • {formatTime(item.time)}
                </Text>
              </View>
            </View>

            {/* Sağ kısım: tutar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 8,
              }}
            >
              <Text
                style={{
                  color:
                    item.type === "gelir" ? theme.success : theme.error,
                  fontSize: dimensions.fontLG,
                  fontWeight: "500",
                }}
              >
                {item.type === "gelir" ? "+" : "-"}
                {formatTotal(Math.abs(item.total_amount), currency)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
>>>>>>> 2742bcc (ilk yükleme)
      )}
    </View>
  );
}
