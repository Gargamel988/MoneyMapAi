
import { useResponsive } from "@/src/hooks/useResponsive";
import { Feather } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Modal, Text, View } from "react-native";
import { useTheme } from "../../contexts/theme";

export const NoInternetOverlay: React.FC = () => {
  const { wp, hp, dimensions, isTablet } = useResponsive();
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isConnected) return null;

  const iconSize = isTablet ? wp(12) : wp(20);

  return (
    <Modal transparent visible={!isConnected} animationType="fade">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LinearGradient
          colors={["rgba(10, 10, 26, 0.95)", "rgba(26, 10, 50, 0.98)"]}
          style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}
        >
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              width: isTablet ? wp(60) : wp(85), 
              padding: wp(isTablet ? 6 : 8), 
              borderRadius: 32, 
              backgroundColor: "rgba(255, 255, 255, 0.03)", 
              borderWidth: 1, 
              borderColor: "rgba(255, 255, 255, 0.1)", 
              alignItems: "center", 
              shadowColor: "#000", 
              shadowOffset: { width: 0, height: 10 }, 
              shadowOpacity: 0.5, 
              shadowRadius: 20, 
              elevation: 10 
            }}
          >
            <View style={{ marginBottom: 24, position: "relative", justifyContent: "center", alignItems: "center" }}>
              <LinearGradient
                colors={["#FF3B30", "#FF9500"]}
                style={{ 
                  width: iconSize, 
                  height: iconSize, 
                  borderRadius: iconSize / 2, 
                  justifyContent: "center", 
                  alignItems: "center", 
                  zIndex: 2, 
                  shadowColor: "#FF3B30", 
                  shadowOffset: { width: 0, height: 0 }, 
                  shadowOpacity: 0.6, 
                  shadowRadius: 15 
                }}
              >
                <Feather name="wifi-off" size={iconSize / 2} color="#FFF" />
              </LinearGradient>
              
              <View style={{ position: "absolute", width: iconSize, height: iconSize, borderRadius: iconSize / 2, borderWidth: 1, borderColor: "rgba(255, 59, 48, 0.3)", transform: [{ scale: 1.2 }] }} />
              <View style={{ position: "absolute", width: iconSize, height: iconSize, borderRadius: iconSize / 2, borderWidth: 1, borderColor: "rgba(255, 59, 48, 0.3)", transform: [{ scale: 1.5 }] }} />
            </View>

            <Text style={{ fontSize: isTablet ? 28 : 24, fontWeight: "800", textAlign: "center", marginBottom: 12, letterSpacing: 0.5, color: theme.text }}>
              {t("common.no_internet_title", "İnternet Bağlantısı Yok")}
            </Text>
            
            <Text style={{ fontSize: isTablet ? 18 : 16, textAlign: "center", lineHeight: isTablet ? 28 : 24, marginBottom: 24, opacity: 0.8, color: theme.textSecondary }}>
              {t("common.no_internet_description", "Uygulamayı kullanabilmek için lütfen internete bağlanın. MoneyMapAi çevrimdışı modda çalışamaz.")}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 214, 10, 0.15)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6 }}>
              <Feather name="alert-circle" size={14} color="#FFD60A" />
              <Text style={{ color: "#FFD60A", fontSize: 12, fontWeight: "600" }}>{t("common.offline_not_supported", "Çevrimdışı Mod Desteklenmiyor")}</Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </View>
    </Modal>
  );
};
