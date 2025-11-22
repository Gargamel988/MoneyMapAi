import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { getProfil } from "../../../src/lib/profil";
import { avatar } from "../../../src/utils/avatar";
import { useTheme } from "../../contexts/theme";
import { useResponsive } from "../../hooks/useRespons";

const Header = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions, isTablet, wp, hp } = useResponsive();
  const { data: user } = useQuery({
    queryKey: ["profil"],
    queryFn: () => getProfil(),
  });
  const avatarUrl = user?.data?.avatar_url;
  const name =  user?.data?.name;
  const username = user?.data?.username;
  const firstName = name?.charAt(0);
  const lastName = username?.charAt(0);
  const getAvatarSource = () => {
    if (!avatarUrl) return null;
    
    // Eğer avatar_url bir sayı ise (1-10 arası)
    const avatarId = Number(avatarUrl);
    if (!isNaN(avatarId) && avatarId >= 1 && avatarId <= 10) {
      const avatarItem = avatar.find(item => item.id === avatarId);
      return avatarItem ? avatarItem.image : null;
    }
    
    // Değilse URL olarak kullan
    return { uri: avatarUrl }; 
  };
  return (
    <View
      style={{
        paddingHorizontal: isTablet ? dimensions.lg : dimensions.md,
        paddingVertical: dimensions.md,
        paddingTop: isTablet ? dimensions.lg : dimensions.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.headerbackground,
      }}
    >
      {/* Logo/Icon */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Image
          style={{
            width: wp(15),
            height: hp(5),
          }}
          source={require("../../../assets/logo.png")}
          resizeMode="cover"
        />
        <Text
          style={{
            fontSize: dimensions.fontTitle,
            color: theme.text,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {t("header.brand.name")}
          <Text
            style={{
              color: theme.textPrimary,
            }}
          >
            {t("header.brand.ai")}
          </Text>
        </Text>
      </View>

      {/* Right Section - Notifications & Profile */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {/* Profile */}
        <TouchableOpacity
          onPress={() => router.push("/(screens)/(stack)/profile")}
        >

          {getAvatarSource() ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: wp(10),
                height: hp(5),
                borderWidth: 2,
                borderRadius: 10,
                borderColor: theme.white,
                overflow: "hidden",
              }}
            >
              <Image
                source={getAvatarSource()}
                style={{ width: "100%", height: "100%",  objectFit: "cover", backgroundColor: theme.white}}
              />
            </View>
          ) : (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: theme.inputbackground,
                borderWidth: 2,
                borderColor: "rgba(255, 255, 255, 0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: theme.text, fontSize: dimensions.fontMD, fontWeight: "700" }}
              >
                {firstName}
                {lastName}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
