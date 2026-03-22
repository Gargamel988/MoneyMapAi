// src/contexts/ThemeContext.tsx
import { Theme, themes } from '@/src/constants/themes';
export type { Theme };
import { QUERY_KEYS } from '@/src/constants/queryKeys';
import { getTheme, updateTheme } from '@/src/lib/profile';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

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
  const [themeMode, setThemeMode] = useState<string>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: savedTheme, isLoading: isLoadingTheme } = useQuery({
    queryKey: QUERY_KEYS.user.theme(),
    queryFn: getTheme,
  });

  useEffect(() => {
    if (savedTheme) {
      setThemeMode(savedTheme.theme as string);
      setIsInitialized(true);
    } else if (!isLoadingTheme) {
      setIsInitialized(true);
    }
  }, [savedTheme, isLoadingTheme]);

  const saveTheme = async (mode: string) => {
    await updateTheme(mode);
  };

  const getActiveTheme = (mode?: string): Theme => {
    const currentMode = mode || themeMode;
    if (currentMode === 'system') {
      return themes.system;
    }
    return themes[currentMode as keyof typeof themes] || themes.system;
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

  const getThemeBackgroundColor = (themeName: string): string => {
    const themeColors: Record<string, string> = {
      system: "#4A7FA7",
      serene: "#4a4b6d",
      elegant: "#b792a5",
      nature: "#023D54",
      forest: "#0F2A1D",
      deepsea: "#0B272A",
      warmearth: "#352223",
      midnight: "#241B1D",
    };
    return themeColors[themeName] || themeColors.system;
  };

  if (isLoadingTheme || !isInitialized) {
    // savedTheme varsa onu kullan, yoksa themeMode'u kullan
    const loadingThemeMode = savedTheme?.theme as string || themeMode;
    const loadingTheme = getActiveTheme(loadingThemeMode);
    const backgroundColor = getThemeBackgroundColor(loadingThemeMode);
    
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color={loadingTheme.primary} />
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