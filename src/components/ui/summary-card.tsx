import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useRespons";
import { formatTotal } from "../../utils/total";

interface SummaryCardProps {
  title: string;
  value: number;
  subtitle?: string;
  color: string;
}
export function SummaryCard({
  title,
  value,
  subtitle,
  color,
}: SummaryCardProps) {
  const { theme } = useTheme();
  const { wp, dimensions, hp } = useResponsive();
  return (
    <View
      style={{
        backgroundColor: theme.summarycard,
        borderRadius: wp(3),
        maxWidth: wp(28),
        paddingHorizontal: wp(3),
        paddingTop: hp(2),
        paddingBottom: hp(1),
        borderLeftWidth: wp(0.8),
        borderLeftColor: color,
      }}
    >
      <Text
        style={{
          fontSize: dimensions.fontXS,
          color: theme.text,
          marginBottom: dimensions.xs,
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: dimensions.fontSM,
          color: theme.text,
          fontWeight: "700",
        }}
      >
        {formatTotal(value)}
      </Text>
      <Text
        style={{
          fontSize: dimensions.fontXS,
          color: theme.textSecondary,
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
