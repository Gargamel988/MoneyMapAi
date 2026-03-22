import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Theme } from "../../../contexts/theme";

interface IncomeHeaderProps {
  t: (key: string) => string;
  theme: Theme;
  dimensions: any;
  onAddCategory: () => void;
}

export const IncomeHeader = ({ t, theme, dimensions, onAddCategory }: IncomeHeaderProps) => (
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
          backgroundColor: `${theme.success}15`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name="trending-up" size={22} color={theme.success} />
      </View>
      <View>
        <Text
          style={{
            fontSize: dimensions.fontLG,
            fontWeight: "700",
            color: theme.textSenary,
          }}
        >
          {t("income.title")}
        </Text>
        <Text
          style={{
            fontSize: dimensions.fontXS,
            color: theme.textTertiary,
            marginTop: 2,
          }}
        >
          {t("income.subtitle") || "Gelir kaydı ekle"}
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
        backgroundColor: `${theme.success}15`,
      }}
    >
      <Feather name="plus" size={16} color={theme.success} />
      <Text
        style={{
          fontSize: dimensions.fontXS,
          fontWeight: "600",
          color: theme.success,
        }}
      >
        {t("income.addCategory")}
      </Text>
    </TouchableOpacity>
  </View>
);
