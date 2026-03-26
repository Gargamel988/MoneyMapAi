import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useResponsive";
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
        backgroundColor: theme.cardGlass,
        borderRadius: wp(3),
        maxWidth: wp(28),
        paddingHorizontal: wp(3),
        paddingTop: hp(2),
        paddingBottom: hp(1.5),
        borderLeftWidth: wp(1),
        borderLeftColor: color,
        flex: 1, // Let cards flex evenly
      }}
    >
      <Text
        style={{
          fontSize: dimensions.fontXS,
          color: theme.textSecondary,
          marginBottom: dimensions.xs,
          fontWeight: "600",
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: dimensions.fontSM,
          color: theme.text,
          fontWeight: "700",
          marginVertical: 4,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatTotal(value)}
      </Text>
      <Text
        style={{
          fontSize: dimensions.fontXS,
          color: theme.textSecondary,
          fontWeight: "500"
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
