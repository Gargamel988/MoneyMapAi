import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Theme } from '../../../src/constanst/themes';
import { useTheme } from '../../../src/contexts/theme';
import { useResponsive } from '../../../src/hooks/useRespons';

export default function ThemeSelector() {
  const { theme, themeMode, setThemeMode, availableThemes } = useTheme();
  const { isSmall, dimensions } = useResponsive();
  const [selectedTheme, setSelectedTheme] = useState(themeMode);

  const handleThemeSelect = (themeKey: string) => {
    setSelectedTheme(themeKey);
    setThemeMode(themeKey);
  };

  const handleGoBack = () => {
    router.back();
  };

        const renderThemeItem = (themeKey: string, themeData: Theme) => {
          const isSelected = selectedTheme === themeKey;
          const screenWidth = Dimensions.get('window').width;
          const cardWidth = (screenWidth - (dimensions.lg * 3)) / 2;
          
          return (
            <TouchableOpacity
              key={themeKey}
              style={{
                width: cardWidth,
                marginBottom: dimensions.lg,
                borderRadius: dimensions.borderRadiusXL,
                overflow: 'hidden',
                transform: isSelected ? [{ scale: 1.05 }] : [{ scale: 1 }],
                borderWidth: isSelected ? 3 : 1,
                borderColor: isSelected ? themeData.primary : 'rgba(255, 255, 255, 0.2)',
              }}
              onPress={() => handleThemeSelect(themeKey)}
              activeOpacity={0.8}
            >
        {/* Tema Önizleme Kartı */}
        <LinearGradient
          colors={themeData.gradientColors as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 120,
            padding: dimensions.sm,
          }}
        >
          {/* Mini Uygulama Önizlemesi */}
          <View style={{
            flex: 1,
            backgroundColor: themeData.summarycard,
            borderRadius: dimensions.borderRadius,
            padding: dimensions.sm,
            justifyContent: 'space-between',
          }}>
            {/* Header */}
            <View style={{
              height: 8,
              backgroundColor: themeData.primary,
              borderRadius: 4,
              width: '60%',
            }} />
            
            {/* Content Lines */}
            <View style={{ gap: 4 }}>
              <View style={{
                height: 6,
                backgroundColor: themeData.textSecondary,
                borderRadius: 3,
                width: '80%',
              }} />
              <View style={{
                height: 6,
                backgroundColor: themeData.textSecondary,
                borderRadius: 3,
                width: '70%',
              }} />
              <View style={{
                height: 6,
                backgroundColor: themeData.textSecondary,
                borderRadius: 3,
                width: '50%',
              }} />
            </View>
            
            {/* Button */}
            <View style={{
              height: 12,
              backgroundColor: themeData.buttonprimary,
              borderRadius: 6,
              width: '40%',
            }} />
          </View>
        </LinearGradient>
        
        {/* Tema Bilgileri */}
        <View style={{
          padding: dimensions.sm,
          backgroundColor: theme.modalbackground,
        }}>
          <Text style={{
            fontSize: dimensions.fontMD,
            fontWeight: '700',
            marginBottom: 4,
            color: theme.text,
            textAlign: 'center',
          }}>
            {themeData.name}
          </Text>
          <Text style={{
            fontSize: dimensions.fontXS,
            opacity: 0.8,
            color: theme.textSecondary,
            textAlign: 'center',
            lineHeight: 16,
          }}>
            {themeData.description}
          </Text>
        </View>
        
              {/* Seçim İndikatörü */}
              {isSelected && (
                <View style={{
                  position: 'absolute',
                  top: dimensions.sm,
                  right: dimensions.sm,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#22C55E',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Feather name="check" size={16} color="white" />
                </View>
              )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={theme.gradientColors as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: dimensions.lg,
          paddingTop: isSmall ? 50 : 60,
          paddingBottom: dimensions.lg,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: dimensions.fontTitle,
              fontWeight: '800',
              color: theme.text,
              marginBottom: 4,
            }}>
              Tema Seçin
            </Text>
            <Text style={{
              fontSize: dimensions.fontSM,
              color: theme.textSecondary,
              opacity: 0.8,
            }}>
              Uygulamanızın görünümünü kişiselleştirin
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleGoBack} 
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: dimensions.md,
            }}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Tema Listesi */}
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: dimensions.lg,
            paddingBottom: dimensions.lg,
          }}
        >
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            {availableThemes.map(({ key, theme: themeData }) => 
              renderThemeItem(key, themeData)
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={{
          paddingHorizontal: dimensions.lg,
          paddingBottom: isSmall ? 30 : 40,
          paddingTop: dimensions.lg,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}>
          <TouchableOpacity
            style={{
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.primary,
              flexDirection: 'row',
              gap: 8,
            }}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <Feather name="check-circle" size={20} color={theme.text} />
            <Text style={{
              fontSize: dimensions.fontLG,
              fontWeight: '700',
              color: theme.text,
            }}>
              Tema Uygula
            </Text>
          </TouchableOpacity>
          
          <Text style={{
            fontSize: dimensions.fontXS,
            color: theme.textSecondary,
            textAlign: 'center',
            marginTop: dimensions.sm,
            opacity: 0.7,
          }}>
            Seçtiğiniz tema anında uygulanacak
          </Text>
        </View>
      </LinearGradient>
  );
}
