import Feather from "@expo/vector-icons/Feather";
import { Text, View } from "react-native";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useRespons";

type NoDataErrorComponentProps = {
  title?: string;
  message?: string;
  icon?: string;
};

export const NoDataErrorComponent: React.FC<NoDataErrorComponentProps> = ({
  title = "Veri Bulunamadı",
  message = "Gösterilecek veri bulunmamaktadır.",
  icon = "inbox",
}) => {
  const { theme } = useTheme();
  const { dimensions, moderateScale, isTablet } = useResponsive();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: isTablet ? dimensions.xl : dimensions.lg,
        paddingVertical: isTablet ? dimensions.xxl : dimensions.xl,
      }}
    >
      <View
        style={{
          padding: isTablet ? dimensions.xxl : dimensions.xl,
          alignItems: "center",
          borderRadius: dimensions.borderRadiusLG,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)",
          minWidth: isTablet ? moderateScale(320) : moderateScale(280),
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: isTablet ? moderateScale(96) : moderateScale(80),
            height: isTablet ? moderateScale(96) : moderateScale(80),
            backgroundColor: theme.primary + "20",
            borderRadius: moderateScale(100),
            justifyContent: "center",
            alignItems: "center",
            marginBottom: isTablet ? dimensions.xl : dimensions.lg,
          }}
        >
          <Feather 
            name={icon as any} 
            size={isTablet ? dimensions.iconXL : dimensions.iconLG} 
            color={theme.primaryDark} 
          />
        </View>

        {/* Title */}
        <Text
          style={{
            color: theme.inputtitle,
            fontSize: isTablet ? dimensions.fontXXL : dimensions.fontXL,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: dimensions.sm,
          }}
        >
          {title}
        </Text>

        {/* Message */}
        <Text
          style={{
            color: theme.inputtitle,
            fontSize: isTablet ? dimensions.fontLG : dimensions.fontMD,
            textAlign: "center",
            marginBottom: dimensions.sm,
          }}
        >
          {message}
        </Text>
      </View>
    </View>
  );
};

export const ErrorFallback: React.FC<{ error: any }> = ({ error }) => {
  const { theme } = useTheme();
  const { dimensions, moderateScale, isTablet } = useResponsive();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: isTablet ? dimensions.xl : dimensions.lg,
        paddingVertical: isTablet ? dimensions.xxl : dimensions.xl,
      }}
    >
      <View
        style={{
          padding: isTablet ? dimensions.xxl : dimensions.xl,
          alignItems: "center",
          borderRadius: dimensions.borderRadiusLG,
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          borderWidth: 1,
          borderColor: "rgba(255, 0, 0, 0.2)",
          minWidth: isTablet ? moderateScale(320) : moderateScale(280),
        }}
      >
        {/* Error Icon */}
        <View
          style={{
            width: isTablet ? moderateScale(96) : moderateScale(80),
            height: isTablet ? moderateScale(96) : moderateScale(80),
            backgroundColor: theme.error + "20",
            borderRadius: moderateScale(100),
            justifyContent: "center",
            alignItems: "center",
            marginBottom: isTablet ? dimensions.xl : dimensions.lg,
          }}
        >
          <Feather 
            name="alert-triangle" 
            size={isTablet ? dimensions.iconXL : dimensions.iconLG} 
            color={theme.error} 
          />
        </View>

        {/* Error Title */}
        <Text
          style={{
            color: theme.primary,
            fontSize: isTablet ? dimensions.fontXXL : dimensions.fontXL,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: dimensions.sm,
          }}
        >
          Hata Oluştu
        </Text>

        {/* Error Message */}
        <Text
          style={{
            color: theme.primary,
            fontSize: isTablet ? dimensions.fontLG : dimensions.fontMD,
            textAlign: "center",
            marginBottom: dimensions.sm,
          }}
        >
          lütfen daha sonra tekrar deneyin
        </Text>
      </View>
    </View>
  );
};