import { supabase } from "@/src/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useTheme } from "../../../src/contexts/theme";
import { hp, useResponsive } from "../../../src/hooks/useRespons";

export default function TabLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions } = useResponsive();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) =>
      data.session?.user || router.replace("/(screens)/(auth)/login")
    );
  }, []);

  return (
      <Tabs
        screenOptions={{
          sceneStyle: {
            backgroundColor: "transparent",
          },
          headerShown: false,
          animation: "shift",
          tabBarActiveTintColor: theme.tabbariconactive,
          tabBarInactiveTintColor: theme.tabbariconinactive,
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: theme.headerbackground }} />
            
          ),
          tabBarStyle: {
            borderTopColor: "transparent",
            height: hp(13),
            paddingBottom: dimensions.md,
            paddingTop: dimensions.xs,
          },
          tabBarLabelStyle: {
            fontSize: dimensions.fontSM,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: t("tabs.home"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ai-chat"
          options={{
            title: t("tabs.ai"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flash" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: t("tabs.analytics"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="analytics" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: t("tabs.settings"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />

      
      </Tabs>
  );
}
