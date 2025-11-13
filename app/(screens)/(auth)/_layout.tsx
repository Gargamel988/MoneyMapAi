import { Stack } from 'expo-router';

export default function _layout() {
  return (
	<Stack screenOptions={{ 
		headerShown: false ,
		contentStyle: { backgroundColor: "transparent" },
		animation: "slide_from_right",
	}}>
		<Stack.Screen name="welcome" />
		<Stack.Screen name="login" />
		<Stack.Screen name="register" />
		<Stack.Screen name="email-control" />
	</Stack>
  );
}