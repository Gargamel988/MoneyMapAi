import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useResponsive";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
type SortType = "name-asc" | "name-desc" | "date-newest" | "date-oldest";
type FilterType = "hepsi" | "gelir" | "gider";

interface SearchFilterBarProps {
  allCount: number;
  incomeCount: number;
  expenseCount: number;
  bool: boolean;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  setFilterType: (type: FilterType) => void;
  filterType: FilterType;
  setSortBy: (sort: SortType) => void;
  sortBy: SortType;
  onAdd?: () => void;
}

export default function SearchFilterBar({
  allCount,
  incomeCount,
  expenseCount,
  bool,
  setSearchQuery,
  searchQuery,
  setFilterType,
  filterType,
  setSortBy,
  sortBy,
  onAdd,
}: SearchFilterBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { dimensions, isSmall, moderateScale } = useResponsive();
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: dimensions.md }}>
      {/* Başlık ve Geri Butonu */}
      <View
        style={{
          marginBottom: dimensions.md,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: dimensions.sm,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            borderRadius: 999,
            padding: dimensions.sm + 4,
            backgroundColor: theme.buttonquaternary,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Feather
            name="arrow-left"
            size={isSmall ? dimensions.iconMD : dimensions.iconLG}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: isSmall ? 1 : 0,
            justifyContent: "center",
            marginRight: bool ? 0 : moderateScale(50),
          }}
        >
          <Feather
            name={bool ? "tag" : "calendar"}
            size={isSmall ? dimensions.iconMD : dimensions.iconLG}
            color="#FFFFFF"
          />
          <Text
            style={{
              fontSize: isSmall
                ? dimensions.fontTitle
                : moderateScale(dimensions.fontTitle + 2),
              fontWeight: "800",
              marginLeft: moderateScale(8),
              color: theme.white,
            }}
          >
            {bool ? t("searchFilterBar.title") : t("searchFilterBar.history")}
          </Text>
        </View>
        {bool && (
          <TouchableOpacity
            onPress={onAdd}
            activeOpacity={0.8}
            style={{
              borderRadius: 999,
              paddingHorizontal: isSmall ? dimensions.md : dimensions.lg,
              paddingVertical: isSmall ? dimensions.sm : dimensions.md,
              backgroundColor: theme.buttonquaternary,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Feather
              name="plus"
              size={isSmall ? dimensions.iconMD : dimensions.iconLG}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Arama Çubuğu */}
      <View style={{ marginBottom: dimensions.sm }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: isSmall ? moderateScale(20) : moderateScale(24),
            paddingHorizontal: isSmall ? moderateScale(12) : moderateScale(16),
            paddingVertical: moderateScale(4),
            backgroundColor: theme.inputbackground,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Feather
            name="search"
            size={dimensions.iconMD}
            color={theme.white}
          />
          <TextInput
            placeholder={t("searchFilterBar.searchPlaceholder")}
            placeholderTextColor={theme.imputplaceholderprimary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              marginLeft: dimensions.sm,
              flex: 1,
              color: theme.text,
              fontSize: dimensions.fontMD,
            }}
          />
        </View>
      </View>

      {/* Filtreler */}
      <Text
        style={{
          marginBottom: dimensions.xs,
          fontSize: isSmall
            ? dimensions.fontTitle
            : moderateScale(dimensions.fontTitle + 2),
          fontWeight: "600",
          color: theme.text,
        }}
      >
        {t("searchFilterBar.filters")}
      </Text>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: dimensions.sm,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {["hepsi", "gelir", "gider"].map((type) => (
            <TouchableOpacity
              key={type as FilterType}
              onPress={() => setFilterType(type as FilterType)}
              activeOpacity={1}
              style={{
                borderRadius: 999,
                paddingHorizontal: moderateScale(18),
                paddingVertical: moderateScale(8),
                backgroundColor: filterType === type ? theme.button : theme.buttonquaternary,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
                elevation: 2,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: filterType === type ? theme.textSenary : theme.text,
                  fontSize: isSmall ? dimensions.fontSM : dimensions.fontMD,
                  textAlign: "center",
                }}
              >
                {type === "hepsi"
                  ? `${t("searchFilterBar.all")} (${allCount})`
                  : type === "gelir"
                    ? `${t("searchFilterBar.income")} (${incomeCount})`
                    : `${t("searchFilterBar.expense")} (${expenseCount})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sıralama */}
      <Text
        style={{
          marginTop: dimensions.xs,
          marginBottom: dimensions.xs,
          fontSize: dimensions.fontTitle,
          fontWeight: "600",
          color: theme.text,
        }}
      >
        {t("searchFilterBar.sort")}
      </Text>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: moderateScale(10),
            flex: 1,
            justifyContent: "center",
          }}
        >
          {["name-asc", "name-desc", "date-newest", "date-oldest"].map(
            (sort) => (
              <TouchableOpacity
                key={sort as SortType}
                onPress={() => setSortBy(sort as SortType)}
                activeOpacity={1}
                style={{
                  borderRadius: 999,
                  paddingHorizontal: moderateScale(18),
                  paddingVertical: moderateScale(8),
                  backgroundColor: sortBy === sort ? theme.button : theme.buttonquaternary,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  elevation: 2,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    color: sortBy === sort ? theme.textSenary : theme.text,
                    fontSize: dimensions.fontSM,
                    textAlign: "center",
                  }}
                >
                  {sort === "name-asc"
                    ? t("searchFilterBar.sortAZ")
                    : sort === "name-desc"
                      ? t("searchFilterBar.sortZA")
                      : sort === "date-newest"
                        ? t("searchFilterBar.sortNewest")
                        : t("searchFilterBar.sortOldest")}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </View>
  );
}
