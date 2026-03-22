import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/theme';
import { useResponsive } from '../../hooks/useResponsive';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StackHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const StackHeader = ({ title, onBack, rightElement }: StackHeaderProps) => {
  const { theme } = useTheme();
  const { wp, hp, dimensions } = useResponsive();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.headerbackground }}>
      <View style={[styles.container, { height: hp(7), paddingHorizontal: wp(4) }]}>
        <View style={styles.leftSection}>
          <TouchableOpacity 
            onPress={handleBack} 
            style={[styles.backButton, { backgroundColor: theme.cardGlass, borderColor: theme.cardBorder }]}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text, fontSize: dimensions.fontLG }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        
        {rightElement && (
          <View style={styles.rightSection}>
            {rightElement}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
