// src/contexts/ThemeContext.tsx
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Theme, themes } from '../constanst/themes';
import { getTheme, updateTheme } from '../lib/profil';

interface ThemeContextType {
  theme: Theme;
  themeMode: string;
  setThemeMode: (mode: string) => void;
  themes: typeof themes;
  availableThemes: { key: string; theme: Theme }[];
  isLoadingTheme: boolean;
  data: Theme | null;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [themeMode, setThemeMode] = useState<string>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: savedTheme, isLoading: isLoadingTheme } = useQuery({
    queryKey: ['theme'],
    queryFn: getTheme,
  });

  useEffect(() => {
    if (savedTheme) {
      setThemeMode(savedTheme.theme as string);
      setIsInitialized(true);
    } else if (!isLoadingTheme) {
      // Tema yoksa default olarak system kullan
      setIsInitialized(true);
    }
  }, [savedTheme, isLoadingTheme]);

  const saveTheme = async (mode: string) => {
    await updateTheme(mode);
  };

  const getActiveTheme = (): Theme => {
    if (themeMode === 'system') {
      return themes.system;
    }
    return themes[themeMode as keyof typeof themes] || themes.system;
  };

  const handleSetThemeMode = (mode: string) => {
    setThemeMode(mode);
    saveTheme(mode);
  };

  const theme = getActiveTheme();

  const availableThemes = Object.entries(themes).map(([key, theme]) => ({
    key,
    theme,
  }));

  // Tema yüklenene kadar loading ekranı göster
  if (isLoadingTheme || !isInitialized) {
    // Inline loading screen - theme'e bağımlı değil
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#4A7FA7', // Sabit renk kullan
        }}
      >
        <ActivityIndicator size="large" color="#6366f1" />
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            color: '#1F2937',
            fontWeight: '500',
          }}
        >
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode: handleSetThemeMode,
        themes,
        availableThemes,
        isLoadingTheme,
        data: savedTheme as Theme | null,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};