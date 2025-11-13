import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../src/contexts/theme";

export default function Index() {
  const { isLoading, user } = useAuth();
  const { theme } = useTheme();


  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.white,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(screens)/(main)/home" />; 
  }
  if (!user) {
    return <Redirect href="/(screens)/(auth)/welcome" />;
  }

  return <Redirect href="/(screens)/(auth)/welcome" />;
}