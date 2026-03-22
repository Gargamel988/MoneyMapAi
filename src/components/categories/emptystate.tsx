import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useResponsive";

export const EmptyState = ({ onAdd }: { onAdd: () => void }) => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const { dimensions } = useResponsive();
	return (
	<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
	  <Feather name="folder-plus" size={dimensions.iconLG} color={theme.primary} /> 
	  <Text style={{ marginTop: dimensions.md, fontSize: dimensions.fontLG, fontWeight: '700', color: theme.text }}>{t("emptyState.categories.title")}</Text>
	  <Text style={{ marginTop: dimensions.sm, textAlign: 'center', opacity: 0.6, color: theme.text }}>
		{t("emptyState.categories.message")}
	  </Text>
	  <TouchableOpacity
		onPress={onAdd}
		style={{
		  marginTop: dimensions.lg,
		  borderRadius: 16,
		  paddingHorizontal: dimensions.md,
		  paddingVertical: dimensions.sm,
		  backgroundColor: theme.inputtitle,
		  shadowColor: '#000',
		  shadowOffset: { width: 0, height: 2 },
		  shadowOpacity: 0.1,
		  shadowRadius: 4,
		  elevation: 3,
		}}>
		<Text style={{ fontWeight: '700', color: theme.text }}>{t("emptyState.categories.addButton")}</Text>
	  </TouchableOpacity>
	</View>
  );
};