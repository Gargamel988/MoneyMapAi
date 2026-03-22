import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../src/contexts/theme";
import { useResponsive } from "../src/hooks/useResponsive";

const WelcomeScreen = () => {
  const [fontsLoaded, error] = useFonts({
    lucy: require("../assets/font/lucy.otf"),
    sans: require("../assets/font/sansitalic.ttf"),
    display: require("../assets/font/display.otf"),
  });
  const { hp, wp, dimensions } = useResponsive();
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (!fontsLoaded || error) {
    return null;
  }

  const Properties = [
    {
      id: 1,
      title:
        "Yapay zekÃ¢ ile fotoÄŸraf Ã§ekin, verinizi akÄ±llÄ± analizle geleceÄŸe taÅŸÄ±yÄ±n",
    },
    {
      id: 2,
      title: "KapsamlÄ± analiz, net sonuÃ§lar",
    },
    {
      id: 3,
      title: "Tercihinize gÃ¶re: Elle ekleme seÃ§eneÄŸiyle tam kontrol sizde.",
    },
    {
      id: 4,
      title: "Her kullanÄ±cÄ±ya Ã¶zel, esnek ve kiÅŸiselleÅŸtirilebilir yapÄ±",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: wp(8) }}>
        {/* Card Container */}
        <View
          style={{
            padding: wp(4),
            marginTop: hp(3),
            borderRadius: dimensions.borderRadiusXL + 5,
            backgroundColor: theme.imagecard,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Image
            source={require("../assets/welcome.png")}
            resizeMode="cover"
            style={{
              height: hp(25),
              width: "100%",
              borderRadius: dimensions.borderRadiusXL + 5,
            }}
          />
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: hp(2),
          }}
        >
          <Text
            style={{
              fontSize: dimensions.fontLarge + 10,
              color: theme.text,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            MoneyMap
            <Text
              style={{
                color: theme.textPrimary,
              }}
            >
              Ai
            </Text>
          </Text>
          <Text
            style={{
              fontSize: dimensions.fontXXL,
              color: theme.text,
              fontFamily: "display",
            }}
          >
            {t("welcome.title")}
          </Text>
        </View>

        <View style={{ gap: hp(2), flex: 1, marginBottom: hp(20) }}>
          {Properties.map((property) => (
            <View
              key={property.id}
              style={{ flexDirection: "row", gap: wp(2), alignItems: "center" }}
            >
              <Feather
                name="check"
                size={dimensions.iconMD}
                color={theme.text}
              />
              <Text
                style={{
                  fontSize: dimensions.fontMD,
                  color: theme.text,
                  fontFamily: "sans",
                  textAlign: "left",
                }}
              >
                {t(`welcome.property.${property.id}`)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ paddingBottom: hp(4) }}>
          {/* Start Button */}
          <TouchableOpacity
            style={{
              paddingVertical: hp(2),
              marginBottom: hp(2),
              minHeight: 50,
              borderRadius: dimensions.borderRadiusLG,
              backgroundColor: theme.button,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            activeOpacity={0.8}
            onPress={() => router.push("/(screens)/(auth)/register" as never)}
          >
            <Text
              style={{
                fontSize: dimensions.fontLG,
                color: theme.text,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {t("start.button")}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: dimensions.fontMD,
                color: theme.textSecondary,
                marginRight: wp(1),
              }}
            >
              {t("login.link")}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(screens)/(auth)/login")}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontSize: dimensions.fontMD - 0.5,
                  textDecorationLine: "underline",
                  fontWeight: "bold",
                  color: theme.link,
                }}
              >
                {t("login.button")}
              </Text>
            </TouchableOpacity>


          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

