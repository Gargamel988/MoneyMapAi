import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/theme";
import { hp, useResponsive, wp } from "../../hooks/useRespons";

export function ProfileCard({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const { dimensions } = useResponsive();
  return (
    <TouchableOpacity
      onLongPress={ onPress }
      activeOpacity={0.8}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.white,
        borderRadius: wp(3),
        padding: hp(2.5),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: wp(11),
          height: hp(5.5),
          borderRadius: wp(5.5),
          backgroundColor: theme.profilecardbackground,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons
          name={icon as any}
          size={dimensions.fontMD * 1.4}
          color={theme.profilecardiconcolor}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: dimensions.fontXS * 1.3,
            color: theme.textQuinary,
            marginBottom: hp(0.5),
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: dimensions.fontMD * 1.1,
            fontWeight: "600",
            color: theme.textSenary,
          }}
        >
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
