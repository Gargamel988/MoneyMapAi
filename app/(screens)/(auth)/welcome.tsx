import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router } from "expo-router";
<<<<<<< HEAD
import { useTranslation } from "react-i18next";
=======
>>>>>>> 2742bcc (ilk yükleme)
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../src/contexts/theme";
import { useResponsive } from "../../../src/hooks/useRespons";

const FinanceAppScreen = () => {
  const [fontsLoaded, error] = useFonts({
    lucy: require("../../../assets/font/lucy.otf"),
    sans: require("../../../assets/font/sansitalic.ttf"),
    display: require("../../../assets/font/display.otf"),
  });
  const { hp, wp, dimensions } = useResponsive();
  const { theme } = useTheme();
<<<<<<< HEAD
  const { t } = useTranslation();
=======
>>>>>>> 2742bcc (ilk yükleme)

  if (!fontsLoaded || error) {
    return null;
  }

  const Properties = [
    {
      id: 1,
      title:
        "Yapay zekâ ile fotoğraf çekin, verinizi akıllı analizle geleceğe taşıyın",
    },
    {
      id: 2,
      title: "Kapsamlı analiz, net sonuçlar",
    },
    {
      id: 3,
<<<<<<< HEAD
      title: "Tercihinize göre: Elle ekleme seçeneğiyle tam kontrol sizde",
=======
      title: "Tercihinize göre: Elle ekleme seçeneğiyle tam kontrol sizde.",
>>>>>>> 2742bcc (ilk yükleme)
    },
    {
      id: 4,
      title: "Her kullanıcıya özel, esnek ve kişiselleştirilebilir yapı",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: wp(8) }}>
        {/* Card Container */}
        <View
          style={{
            padding: wp(4),
<<<<<<< HEAD
            marginTop: hp(3),
=======
>>>>>>> 2742bcc (ilk yükleme)
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
            source={require("../../../assets/welcome.png")}
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
<<<<<<< HEAD
            {t("welcome.title")}
          </Text>
        </View>

        <View style={{ gap: hp(2), flex: 1, marginBottom: hp(20) }}>
=======
            uygulamamıza hoşgeldiniz!
          </Text>
        </View>

        <View style={{ gap: hp(2) ,flex:1}}>
>>>>>>> 2742bcc (ilk yükleme)
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
<<<<<<< HEAD
                {t(`welcome.property.${property.id}`)}
=======
                {property.title}
>>>>>>> 2742bcc (ilk yükleme)
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
<<<<<<< HEAD
              {t("start.button")}
=======
              Başla
>>>>>>> 2742bcc (ilk yükleme)
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
<<<<<<< HEAD
              {t("login.link")}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(screens)/(auth)/login")}
=======
              Zaten hesabın var mı?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(screens)/(auth)/login" as never)}
>>>>>>> 2742bcc (ilk yükleme)
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
<<<<<<< HEAD
                {t("login.button")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(screens)/(main)/home")}
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
=======
                Giriş Yap
>>>>>>> 2742bcc (ilk yükleme)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FinanceAppScreen;
