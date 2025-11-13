
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "slide_from_right",
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="history" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="add-transactionscreen" />
      <Stack.Screen name="ThemeSelector" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="terms-of-service" />
    </Stack>
  );
}