
import { LoadingScreen } from "@/src/components/common/loading";
import { getLanguage } from "@/src/lib/profile";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import i18n from "i18next";
import { useEffect } from "react";

import { initAds } from "@/src/lib/adsInit";
import Toast from "react-native-toast-message";
import "../polyfills";
import "../services/i18next"; // Initialize i18next
import { QUERY_KEYS } from "../src/constants/queryKeys";
import { toastConfig } from "../src/constants/toast";
import { SessionProvider, useSession } from "../src/contexts/session";
import { ThemeProvider, useTheme } from "../src/contexts/theme";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootNavigator() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(screens)" && segments[1] === "(auth)";
    const inMainGroup = segments[0] === "(screens)" && segments[1] === "(main)";

    if (session?.user) {
      if (inAuthGroup) {
        router.replace("/(screens)/(main)/home");
      }
    } else {
      if (inMainGroup || segments.length <= 1) {
        router.replace("/");
      }
    }

    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "slide_from_right",
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(screens)/(auth)" />
      <Stack.Screen name="(screens)/(main)" />
      <Stack.Screen name="(screens)/(stack)" />
    </Stack>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const { data: language } = useQuery({
    queryKey: QUERY_KEYS.user.language(),
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
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
      <Toast config={toastConfig} />
    </LinearGradient>
  );
}

export default function RootLayout() {
  // useEffect(() => {
  //   initAds();
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StatusBar hidden />
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
