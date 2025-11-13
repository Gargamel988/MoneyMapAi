import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import "../polyfills";
<<<<<<< HEAD
import "../services/i18next"; // Initialize i18next
=======
>>>>>>> 2742bcc (ilk yükleme)
import { toastConfig } from "../src/constanst/toast";
import { ThemeProvider, useTheme } from "../src/contexts/theme";

const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={theme.appbackgroundgradient as [string, string]}
      start={{ x: 0.15, y: 0.15 }}
      end={{ x: 0.85, y: 0.85 }}
      style={{ flex: 1 }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
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
