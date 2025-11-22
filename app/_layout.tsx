
import { getLanguage } from "@/src/lib/profil";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import i18n from "i18next";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "../polyfills";
import "../services/i18next"; // Initialize i18next
import { toastConfig } from "../src/constanst/toast";
import AuthProvider from "../src/contexts/authprovider";
import { ThemeProvider, useTheme } from "../src/contexts/theme";

const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useTheme();
  const { data: language } = useQuery({
    queryKey: ["language"],
    queryFn: () => getLanguage(),
  });
  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language.language || "tr");
    }
  }, [language]);

  return (
    <LinearGradient
      colors={theme.appbackgroundgradient as [string, string]}
      start={{ x: 0.15, y: 0.15 }}
      end={{ x: 0.85, y: 0.85 }}
      style={{ flex: 1 }}
    >
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
            animation: "slide_from_right",
            animationDuration: 300,
          }}
        />
      </AuthProvider>
      <Toast config={toastConfig} />
    </LinearGradient>
  );
}

export default function _layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StatusBar hidden />
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
