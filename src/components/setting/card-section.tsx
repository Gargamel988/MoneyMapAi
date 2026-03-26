import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useResponsive";
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
                    backgroundColor: theme.cardGlass,
                    borderRadius: dimensions.borderRadiusXL,
                    borderWidth: 1.5,
                    borderColor: theme.cardBorder,
                    overflow: 'hidden',
                }}
            >
                {children}
            </View>
        </View>
    );
}
    