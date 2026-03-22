import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useResponsive";
import { formatTotal } from "@/src/utils/total";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { GreenLoadingComponent } from "../common/loading";

//components

interface WeeklyCardProps {
  id: "income" | "expense" | "balance";
  name: string;
  value: number;
  currency: string;
  change?: { percentage: number; isIncrease: boolean };
  isLoading: boolean;
  error: Error;
}

export const WeeklyCard = ({
  id,
  name,
  value,
  currency,
  change,
  isLoading,
  error,
}: WeeklyCardProps) => {
  const { t } = useTranslation();
  const { dimensions, hp, wp } = useResponsive();
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.weeklycard,
        width: wp(90),
        borderRadius: 16,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.8),
        gap: hp(1.2),
        shadowColor: theme.shadow, // Arka planın koyu tonuyla gölge
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      {isLoading ? (
        <GreenLoadingComponent />
      ) : error ? (
        <Text>{error.message}</Text>
      ) : value === 0 || value === null || value === undefined ? (
        <Text
          style={{
            fontSize: dimensions.fontLG,
            fontWeight: "700",
            color: theme.textTertiary,
          }}
        >
          {t("weeklyCard.noData")}
        </Text>
      ) : (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: dimensions.fontLG,
                fontWeight: "700",
                color: theme.textTertiary, // Arka planın koyu tonu
              }}
            >
              {name}
            </Text>
            {change && (
              <Text
                style={{
                  fontSize: hp(1.6),
                  fontWeight: "600",
                  color: change?.isIncrease ? "#2E9B6B" : "#D14444",
                }}
              >
                {change?.isIncrease ? "↗" : "↘"} {change?.percentage.toFixed(1)}
                % {change?.isIncrease ? t("weeklyCard.increase") : t("weeklyCard.decrease")}
              </Text>
            )}
          </View>

          <Text
            style={{
              fontSize: dimensions.fontXXL + 2,
              fontWeight: "bold",
              color:
                id === "expense"
                  ? "#D14444"
                  : value > 0
                  ? "#2E9B6B"
                  : "#D14444",
            }}
          >
            {formatTotal(value, currency)}
          </Text>
        </View>
      )}
    </View>
  );
};
