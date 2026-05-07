import React from "react";
import { View, ViewStyle } from "react-native";
import { Theme } from "../../../contexts/theme";

interface SectionCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  theme: Theme;
  dimensions: any;
}

export const SectionCard = ({ children, style, theme, dimensions }: SectionCardProps) => (
  <View
    style={{
      backgroundColor: theme.weeklycard,
      borderRadius: 16,
      padding: dimensions.md,
      borderWidth: 1,
      borderColor: theme.border,
      ...style,
    }}
  >
    {children}
  </View>
);
