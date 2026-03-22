import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Theme } from "../../../contexts/theme";

interface ExpenseHeaderProps {
  t: (key: string) => string;
  theme: Theme;
  dimensions: any;
  onAddCategory: () => void;
}

export const ExpenseHeader = ({ t, theme, dimensions, onAddCategory }: ExpenseHeaderProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: dimensions.xs,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: `${theme.error}15`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name="trending-down" size={22} color={theme.error} />
      </View>
      <View>
        <Text
          style={{
            fontSize: dimensions.fontLG,
            fontWeight: "700",
            color: theme.textSenary,
          }}
        >
          {t("expense.title")}
        </Text>
        <Text
          style={{
            fontSize: dimensions.fontXS,
            color: theme.textTertiary,
            marginTop: 2,
          }}
        >
          {t("expense.subtitle") || "Gider kaydı ekle"}
        </Text>
      </View>
    </View>

    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onAddCategory}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: `${theme.error}15`,
      }}
    >
      <Feather name="plus" size={16} color={theme.error} />
      <Text
        style={{
          fontSize: dimensions.fontXS,
          fontWeight: "600",
          color: theme.error,
        }}
      >
        {t("expense.addCategory")}
      </Text>
    </TouchableOpacity>
  </View>
);
