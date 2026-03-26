import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/theme";
import { hp, useResponsive, wp } from "../../hooks/useResponsive";
import { Category } from "../../types/transactionTypes";


type CategoryCardProps = {
	category: Category;
	onEdit: (c: Category) => void;
	onDelete: (id: string) => void;
	deleting: boolean;
};
export const CategoryCard = ({
	category,
	onEdit,
	onDelete,
	deleting,
  } : CategoryCardProps) => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const { dimensions } = useResponsive();
	return (
	<View
	  style={{
		marginBottom: dimensions.sm,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 16,
		padding: dimensions.md,
		backgroundColor: theme.white,
		borderColor: category.color,
		borderWidth: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	  }}>
	  <View
		style={{
		  marginRight: dimensions.md,
		  width: wp(12),
		  height: hp(6),
		  borderRadius: 12,
		  alignItems: 'center',
		  justifyContent: 'center',
		  backgroundColor: category.color + '22',
		}}>
		<Feather name={category.icon as any} size={dimensions.iconMD} color={category.color} />
	  </View>
  
	  <View style={{ flex: 1 }}>
		<Text style={{ fontSize: dimensions.fontLG, fontWeight: '700', color: theme.textTertiary }}>
			{category.name.startsWith('categories.default') ? t(category.name) : category.name}
		</Text>
		<Text style={{ fontSize: dimensions.fontSM, textTransform: 'capitalize', opacity: 0.6, color: theme.textTertiary }}>
		  {category.type === 'gelir' ? t("searchFilterBar.income") : t("searchFilterBar.expense")}
		</Text>
	  </View>
  
	  <TouchableOpacity onPress={() => onEdit(category)} style={{ marginRight: dimensions.md }}>
		<Feather name="edit-3" size={dimensions.iconMD} color={theme.primary} />
	  </TouchableOpacity>
  
	  <TouchableOpacity onPress={() => onDelete(category.id)} disabled={deleting}>
		{deleting ? <ActivityIndicator size="small" color={theme.error} /> : <Feather name="trash-2" size={20} color={theme.error} />}
	  </TouchableOpacity>
	</View>
  );
};