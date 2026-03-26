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
        backgroundColor: theme.cardGlass,
        width: wp(90),
        borderRadius: 20,
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        gap: hp(1.2),
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1.5,
        borderColor: theme.cardBorder,
      }}
    >
      {isLoading ? (
        <GreenLoadingComponent />
      ) : error ? (
        <Text style={{ color: theme.error }}>{error.message}</Text>
      ) : value === 0 || value === null || value === undefined ? (
        <Text
          style={{
            fontSize: dimensions.fontLG,
            fontWeight: "700",
            color: theme.textSecondary,
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
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: dimensions.fontLG,
                fontWeight: "600",
                color: theme.textSecondary,
              }}
            >
              {name}
            </Text>
            {change && (
              <View style={{
                backgroundColor: change.isIncrease ? `${theme.success}15` : `${theme.error}15`,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}>
                <Text
                  style={{
                    fontSize: hp(1.4),
                    fontWeight: "700",
                    color: change.isIncrease ? theme.success : theme.error,
                  }}
                >
                  {change.isIncrease ? "↑" : "↓"} {change.percentage.toFixed(1)}% {change.isIncrease ? t("weeklyCard.increase") : t("weeklyCard.decrease")}
                </Text>
              </View>
            )}
          </View>

          <Text
            style={{
              fontSize: dimensions.fontXXL + 4,
              fontWeight: "800",
              color:
                id === "expense"
                  ? theme.error
                  : value > 0
                    ? theme.success
                    : theme.error,
              marginTop: 4,
            }}
          >
            {formatTotal(value, currency)}
          </Text>
        </View>
      )}
    </View>
  );
};
