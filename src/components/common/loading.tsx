import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '../../contexts/theme';
import { useResponsive } from '../../hooks/useRespons';

type GreenLoadingComponentProps = {
  text?: string;
  size?: 'small' | 'large';
}

export const GreenLoadingComponent: React.FC<GreenLoadingComponentProps> = ({ 
  text = 'Veriler yükleniyor...',
  size = 'small'
}) => {
  const { theme } = useTheme();
  const { dimensions, isTablet } = useResponsive();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        alignItems: 'center',
      }}>
        <ActivityIndicator size={size} color={theme.primary} />
        <Text style={{
          color: theme.textSecondary,
          fontSize: isTablet ? dimensions.fontLG : dimensions.fontMD,
          fontWeight: '500',
          marginTop: dimensions.xs,
        }}>
          {text}
        </Text>
      </View>
    </View>
  );
};

export const LoadingScreen = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{ 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: theme.card 
    }}>
      <GreenLoadingComponent />
    </View>
  );
};