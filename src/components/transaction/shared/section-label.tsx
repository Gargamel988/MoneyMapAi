import React from "react";
import { Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Theme } from "../../../contexts/theme";

type FeatherIconName = keyof typeof Feather.glyphMap;

interface SectionLabelProps {
  icon: FeatherIconName;
  label: string;
  theme: Theme;
  dimensions: any;
  success?: boolean;
}

export const SectionLabel = ({ icon, label, theme, dimensions, success }: SectionLabelProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: dimensions.sm,
    }}
  >
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: success ? `${theme.success}15` : `${theme.error}15`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Feather name={icon} size={14} color={success ? theme.success : theme.error} />
    </View>
    <Text
      style={{
        fontSize: dimensions.fontMD,
        fontWeight: "600",
        color: theme.textSenary,
      }}
    >
      {label}
    </Text>
  </View>
);
