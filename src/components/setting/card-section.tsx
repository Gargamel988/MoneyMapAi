import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useRespons";
import { Text, View } from "react-native";

type CardSectionProps = {
    title: string;
    children: React.ReactNode;
}

export const CardSection = ({
    title,
    children,
  }: CardSectionProps) => {
    const { theme } = useTheme();
    const { dimensions, wp } = useResponsive();

    return (
        <View style={{ marginHorizontal: wp(4), marginTop: dimensions.md }}>
            <Text
                style={{
                    color: theme.text,
                    fontSize: dimensions.fontXL,
                    marginBottom: dimensions.md,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    textShadowColor: theme.shadow,
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                }}
            >
                {title}
            </Text>
            <View
                style={{
                    backgroundColor: theme.white,
                    borderRadius: dimensions.borderRadiusLG,
                    overflow: 'hidden',
                    shadowColor: theme.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                }}
            >
                {children}
            </View>
        </View>
    );
}
    