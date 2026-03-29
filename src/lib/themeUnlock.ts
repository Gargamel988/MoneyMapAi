import AsyncStorage from "@react-native-async-storage/async-storage";

const UNLOCKED_THEMES_KEY = "money_map_ai_unlocked_themes";

// Temel (ücretsiz) temalar
export const FREE_THEMES = [
  "system",
  "serene",
  "elegant",
  "nature",
  "forest",
  "deepsea",
];

// Premium (reklamlı) temalar
export const PREMIUM_THEMES = [
  "royal",
  "cyber",
  "sunset",
  "emerald",
  "coffee",
  "nordic",
  "mint_ice",
  "midnight",
  "warmearth",
];

export const getUnlockedThemes = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(UNLOCKED_THEMES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading unlocked themes", e);
    return [];
  }
};

export const unlockTheme = async (themeKey: string): Promise<boolean> => {
  try {
    const unlocked = await getUnlockedThemes();
    if (!unlocked.includes(themeKey)) {
      const newList = [...unlocked, themeKey];
      await AsyncStorage.setItem(UNLOCKED_THEMES_KEY, JSON.stringify(newList));
      return true;
    }
    return false;
  } catch (e) {
    console.error("Error unlocking theme", e);
    return false;
  }
};

export const isThemeUnlocked = async (themeKey: string): Promise<boolean> => {
  if (FREE_THEMES.includes(themeKey)) return true;
  const unlocked = await getUnlockedThemes();
  return unlocked.includes(themeKey);
};
