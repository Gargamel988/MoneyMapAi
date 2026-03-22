import { useTheme } from "@/src/contexts/theme";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../../src/lib/supabase";

export default function Emailcontrol() {
  const [linkOpened, setLinkOpened] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;

    const handleDeepLink = async (url: string) => {
      if (!url) {
        return;
      }

      try {
        const { params } = QueryParams.getQueryParams(url);

        const code = params["code"];

        const access_token = params["access_token"];
        const refresh_token = params["refresh_token"];

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            return;
          }

          if (data?.session && isMounted) {
            setLinkOpened(true);
          } else if (!isMounted) {
          }
        } else if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            return null;
          }

          if (!error && isMounted) {
            setLinkOpened(true);
          } 
        } 
      } catch  {
      }
    };

    const checkInitialURL = async () => {
      const url = await Linking.getInitialURL();
      await handleDeepLink(url || "");
    };

    checkInitialURL();

    const sub = Linking.addEventListener("url", async (event) => {
      await handleDeepLink(event.url);
    });

    return () => {
      isMounted = false;
      sub?.remove?.();
    };
  }, []);

  useEffect(() => {
    const tryNavigateToMain = async () => {
      if (!linkOpened) {
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (data?.session && !error) {
        setTimeout(() => {
          try {
            router.replace("/(screens)/(main)/home");
          } catch {}
        }, 100);
      } else {
      }
    };

    tryNavigateToMain();
  }, [linkOpened]);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      {!linkOpened ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: theme.text,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {t("emailControl.title")}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: theme.textSecondary,
              textAlign: "center",
              marginBottom: 30,
              lineHeight: 24,
            }}
          >
            {t("emailControl.description")}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: theme.button,
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 12,
              marginTop: 20,
            }}
            onPress={() => {
              router.push("/(screens)/(auth)/register");
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {t("emailControl.backButton")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: theme.white,
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: theme.text,
              fontSize: 16,
              textAlign: "center",
              marginBottom: 20,
              lineHeight: 22,
            }}
          >
            {t("emailControl.successMessage")}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: theme.button,
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 12,
              marginTop: 20,
            }}
            onPress={async () => {
              const { data } = await supabase.auth.getSession();
          

              if (data?.session) {
                router.replace("/(screens)/(main)/home");
              } 
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {t("emailControl.goToHomeButton")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
