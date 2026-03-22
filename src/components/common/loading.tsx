import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '../../contexts/theme';
import { useResponsive } from '../../hooks/useResponsive';

type GreenLoadingComponentProps = {
  text?: string;
  size?: 'small' | 'large';
}

export const GreenLoadingComponent: React.FC<GreenLoadingComponentProps> = ({ 
  text,
  size = 'small'
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions, isTablet } = useResponsive();
  
  const defaultText = text || t("loading.default");

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
          {defaultText}
        </Text>
      </View>
    </View>
  );
};

export const LoadingScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={{ 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'transparent'
    }}>
      <GreenLoadingComponent size='large' text={t("common.loading")} />
    </View>
  );
};