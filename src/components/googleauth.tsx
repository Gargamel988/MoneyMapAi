import { useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity } from "react-native";
import { showErrorToast, showSuccessToast } from "../constanst/toast";
import { useTheme } from "../contexts/theme";
import { useResponsive } from "../hooks/useRespons";
import { insertDefaultExpenseCategories, insertDefaultIncomeCategories } from "../lib/category";
import { getProfil, insertProfil } from "../lib/profil";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

const GoogleSignIn = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { wp, dimensions } = useResponsive();
  const queryClient = useQueryClient();



  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      const redirectUrl = Linking.createURL("/");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        showErrorToast(t('common.error'), t('auth.login.error.startFailed'));
        setLoading(false);
        return;
      }

      if (!data?.url) {
        showErrorToast(t('common.error'), t('auth.login.error.oauthUrl'));
        setLoading(false);
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
        {
          showInRecents: true,
        }
      );

      if (result.type === "cancel") {
        setLoading(false);
        return;
      }

      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        
        const code = url.searchParams.get("code");
        const access_token = url.searchParams.get("access_token");
        const refresh_token = url.searchParams.get("refresh_token");

        if (access_token && refresh_token) {
          const { data: sessionData, error: setSessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (setSessionError || !sessionData?.session) {
            showErrorToast(t('common.error'), t('auth.login.error.sessionFailed'));
            setLoading(false);
            return;
          }

          await handleProfileCreation(sessionData.session);
        } 
        else if (code) {
          const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError || !session) {
            showErrorToast(t('common.error'), t('auth.login.error.authFailed'));
            setLoading(false);
            return;
          }
          
          await handleProfileCreation(session);
        } 
        else {
          showErrorToast(t('common.error'), t('auth.login.error.authInfo'));
          setLoading(false);
        }
      }
    } catch  {
      showErrorToast(t('common.error'), t('auth.login.error.general'));
      setLoading(false);
    }
  };

  const handleProfileCreation = async (session: any) => {
    try {
      const existingProfile = await getProfil();

      if (existingProfile.data === null) {
        const insertResult = await insertProfil(session.user);
        
        if (!insertResult || insertResult?.[0]?.error) {
          showErrorToast(t('common.error'), t('auth.profile.createFailed'));
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        try {
          await Promise.all([
            insertDefaultExpenseCategories(session.user),
            insertDefaultIncomeCategories(session.user)
          ]);
        } catch  {
          showErrorToast(t('common.error'), t('auth.profile.createCategoriesFailed'));
        }

        showSuccessToast(t('common.success'), t('auth.profile.createSuccess'));
      } else {
        showSuccessToast(t('common.success'), t('auth.profile.loginSuccess'));
      }

      await queryClient.invalidateQueries({ queryKey: ["profil"] });
      await queryClient.invalidateQueries({ queryKey: ["theme"] });
    
      router.replace('/(screens)/(main)/home');
      setLoading(false);
      
    } catch  {
      showErrorToast(t('common.error'), t('auth.profile.error'));
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={{
        borderRadius: dimensions.borderRadiusXL,
        paddingVertical: wp(4),
        backgroundColor: theme.button,
        marginTop: wp(2),
      }}
      onPress={handleGoogleSignIn}
      disabled={loading}
    >
      <Text
        style={{
          fontSize: dimensions.fontLG,
          fontWeight: "semibold",
          color: theme.text,
          textAlign: "center",
        }}
      >
        {loading ? t('auth.login.loading') : text}
      </Text>
    </TouchableOpacity>
  );
};

export default GoogleSignIn;