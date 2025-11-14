import { GreenLoadingComponent } from "@/src/components/common/loading";
import SearchFilterBar from "@/src/components/ui/search-filter-bar";
import { ExpenseItem, Transaction } from "@/src/types/transactıonstype";
import { Feather } from "@expo/vector-icons";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ErrorFallback,
  NoDataErrorComponent,
} from "../../../src/components/common/error";
import TransactionDetail from "../../../src/components/transaction/Transaction-detail";
import { useTheme } from "../../../src/contexts/theme";
import { moderateScale, useResponsive, wp } from "../../../src/hooks/useRespons";
import { getCurrency } from "../../../src/lib/profil";
import { transactionsApi } from "../../../src/lib/transactions";
import { formatDate, formatTime } from "../../../src/utils/date";
import { formatTotal } from "../../../src/utils/total";

type sortBy = "date-newest" | "date-oldest" | "name-asc" | "name-desc";

const TransactionHistory = () => {
  const { t } = useTranslation();
  const { dimensions } = useResponsive();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<"hepsi" | "gelir" | "gider">(
    "hepsi"
  );
  const [sortBy, setSortBy] = useState<sortBy>("date-newest");

  const onRefresh = async () => {
    setRefreshing(true);
    allTablesQuery.refetch();
    currencyQuery.refetch();
    setRefreshing(false);
  };
  const [currencyQuery, allTablesQuery] = useQueries({
    queries: [
      {
        queryKey: ["currency"],
        queryFn: getCurrency,
      },
      {
        queryKey: ["allTables"],
        queryFn: transactionsApi.getallTables,
      },
    ],
  });

  const currency = currencyQuery?.data?.currency || "TRY";

  const handleLongPress = (transaction: Transaction) => {
    Alert.alert(
      t("history.delete.title"),
      t("history.delete.message"),
      [
        { text: t("history.delete.cancel"), style: "cancel" },
        {
          text: t("history.delete.confirm"),
          style: "destructive",
          onPress: () => transactionsApi.deleteTransaction(transaction?.id),
        },
      ]
    );
    allTablesQuery.refetch();
  };
  // 1. Önce arama filtresini uygula
  const searchFilteredTransactions = Array.isArray(allTablesQuery.data)
    ? allTablesQuery.data.filter((transaction: Transaction) => {
        if (!transaction) return false;

        // Eğer arama boşsa, tüm işlemleri göster
        if (!searchQuery.trim()) return true;

        const searchLower = searchQuery.toLowerCase().trim();

        const matchesDescription =
          transaction.description &&
          transaction.description.toLowerCase().trim().includes(searchLower);

        const matchesCategory =
          transaction.categories?.name &&
          transaction.categories.name
            .toLowerCase()
            .trim()
            .includes(searchLower);

        const matchesItems =
          transaction.expense_items &&
          transaction.expense_items.some(
            (item: ExpenseItem) =>
              item.item_name &&
              item.item_name.toLowerCase().trim().includes(searchLower)
          );

        return matchesDescription || matchesCategory || matchesItems;
      })
    : [];

  // 2. Sonra tür filtresini uygula (gelir/gider/hepsi)
  const typeFilteredTransactions =
    filterType === "hepsi"
      ? searchFilteredTransactions
      : searchFilteredTransactions.filter(
          (t: Transaction) => t.type === filterType
        );

  // 3. Son olarak sıralama yap
  const getComparableDate = (t: Transaction) => {
    if (!t?.date) return 0;

    const dateTime = new Date(t.date).getTime();

    if (t?.time && t.time.length > 0) {
      // Saat bilgisini parse et ve ekle
      const timeParts = t.time.split(":");
      const hours = parseInt(timeParts[0] || "0");
      const minutes = parseInt(timeParts[1] || "0");
      return dateTime + hours * 3600000 + minutes * 60000;
    }

    return dateTime;
  };
  const getComparableName = (t: Transaction) =>
    (t?.categories?.name || "").toString().toLowerCase();

  const sortedTransactions = [...typeFilteredTransactions].sort(
    (a: Transaction, b: Transaction) => {
      switch (sortBy) {
        case "date-newest":
          return getComparableDate(b) - getComparableDate(a);
        case "date-oldest":
          return getComparableDate(a) - getComparableDate(b);
        case "name-asc":
          return getComparableName(a).localeCompare(getComparableName(b));
        case "name-desc":
          return getComparableName(b).localeCompare(getComparableName(a));
        default:
          return 0;
      }
    }
  );

  // Sayaç hesaplamaları için tüm işlemleri kullan (arama sonuçlarına göre)
  const gelirCount = searchFilteredTransactions.filter(
    (t: Transaction) => t.type === "gelir"
  ).length;
  const giderCount = searchFilteredTransactions.filter(
    (t: Transaction) => t.type === "gider"
  ).length;
  const hepsiCount = searchFilteredTransactions.length;
  // Loading durumu
  if (allTablesQuery.isLoading || currencyQuery.isLoading)
    return <GreenLoadingComponent />;

  // Error durumu
  if (allTablesQuery.error || currencyQuery.error)
    return <ErrorFallback error={allTablesQuery.error as Error} />;

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(6) }}>
      <SearchFilterBar
        allCount={hepsiCount}
        incomeCount={gelirCount}
        expenseCount={giderCount}
        bool={false}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilterType={(type: "hepsi" | "gelir" | "gider") =>
          setFilterType(type)
        }
        filterType={filterType}
        setSortBy={(sort: sortBy) => setSortBy(sort)}
        sortBy={sortBy}
      />
      <FlatList
        data={sortedTransactions}
        keyExtractor={(t: Transaction, index) =>
          t?.id ? String(t.id) : String(index)
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <View style={{ padding: dimensions.lg }}>
            <NoDataErrorComponent
              title={t("history.noData.title")}
              message={t("history.noData.message")}
              icon="inbox"
            />
          </View>
        )}
        ListHeaderComponent={() => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: dimensions.md,
              paddingHorizontal: dimensions.sm,
            }}
          >
            <Text
              style={{
                fontSize: dimensions.fontLG,
                fontWeight: "700",
                color: theme.text,
              }}
            >
              {t("history.title")} ({sortedTransactions.length})
            </Text>
            <Text
              style={{
                fontSize: dimensions.fontSM,
                color: theme.textSecondary,
                fontWeight: "500",
              }}
            >
              {sortedTransactions.reduce(
                (sum: number, t: Transaction) =>
                  sum + (t.expense_items?.length || 0),
                0
              )}{" "}
              {t("history.items")}
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onLongPress={() => handleLongPress(item)}
            key={item.id || index}
            onPress={() => setSelectedTransaction(item)}
            style={{
              backgroundColor: theme.white,
              marginBottom: 8,
              borderRadius: 12,
              padding: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03,
              shadowRadius: 2,
              elevation: 1,
              borderWidth: 1,
              borderColor: theme.border + "20",
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
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: item.categories?.color + "12",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather
                  name={item.categories.icon as any}
                  size={18}
                  color={item.categories.color}
                />
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: theme.inputtitle,
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 2,
                  }}
                >
                  {item.description || t("transactionDetail.noDescription")}
                </Text>

                <View
                  style={{ flexDirection: "row" }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "500",
                      color: item.categories?.color,
                      backgroundColor: item.categories?.color + "15",
                      paddingHorizontal: dimensions.sm,
                      paddingVertical: dimensions.xs-1,
                      borderRadius: moderateScale(7),
                    }}
                  >
                    {item.categories.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: moderateScale(6),
                  }}
                >
                  <Text
                    style={{
                      fontSize: dimensions.fontSM,
                      color: theme.textSecondary,
                    }}
                  >
                    {formatDate(item.date)}
                  </Text>

                  {item.expense_items && item.expense_items.length > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                        backgroundColor: theme.textSecondary + "15",
                      }}
                    >
                      <Feather
                        name="shopping-cart"
                        size={9}
                        color={theme.textSecondary}
                      />
                      <Text
                        style={{
                          fontSize: 10,
                          color: theme.textSecondary,
                          fontWeight: "500",
                        }}
                      >
                        {item.expense_items.length}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Amount */}
              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontSize: dimensions.fontMD,
                    fontWeight: "700",
                    color: item.type === "gelir" ? theme.success : theme.error,
                    marginBottom: dimensions.xs,
                  }}
                >
                  {item.type === "gelir" ? "+" : "-"}
                  {formatTotal(item.total_amount, currency)}
                </Text>

                <Text
                  style={{
                    fontSize: dimensions.fontSM-2,
                    color: theme.textSecondary,
                    fontWeight: "500",
                  }}
                >
                  {formatTime(item.time)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* İşlem Detay Modal */}
      <TransactionDetail
        transaction={selectedTransaction as Transaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </SafeAreaView>
  );
};

export default TransactionHistory;
