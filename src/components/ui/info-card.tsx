import { useTheme } from '@/src/contexts/theme';
import { hp, wp } from '@/src/hooks/useResponsive';
import React from 'react';
import { Text, View } from 'react-native';

export default function InfoCard({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
      style={{
        width: wp(90),
        marginTop: hp(3),
        backgroundColor: theme.cluebackground,
        borderRadius: 12,
        padding: hp(1.8),
        borderLeftWidth: 3,
        borderLeftColor: theme.leftborder,
      }}
    >
      <Text
        style={{
          fontSize: hp(1.5),
          fontWeight: "500",
          color: theme.text,
        }}
      >
        {children}
      </Text>
    </View>
    </View>
  )
}