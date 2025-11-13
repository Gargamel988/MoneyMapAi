import GoogleSignIn from "@/src/components/googleauth";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
<<<<<<< HEAD
import { useTranslation } from "react-i18next";
=======
>>>>>>> 2742bcc (ilk yükleme)
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../src/contexts/theme";
import { useResponsive } from "../../../src/hooks/useRespons";
import { useAuthsignupMutation } from "../../../src/lib/authmutation";
import { LoginFormData, LoginSchema } from "../../../src/schemas/LoginSchema";

export default function Login() {
  const { theme } = useTheme();
  const { hp, wp, dimensions } = useResponsive();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, resetLogin } = useAuthsignupMutation();
<<<<<<< HEAD
  const { t } = useTranslation();
=======
>>>>>>> 2742bcc (ilk yükleme)

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: wp(5),
      }}
    >
      {/* Title */}
      <View
        style={{
          gap: hp(1),
          marginBottom: hp(2),
          marginTop: hp(2),
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: dimensions.fontLarge,
            fontFamily: "display",
            color: theme.text,
          }}
        >
<<<<<<< HEAD
          {t("login.title")}
=======
          Giriş Yap
>>>>>>> 2742bcc (ilk yükleme)
        </Text>
        <Text
          style={{
            fontSize: dimensions.fontMD,
            color: theme.textSecondary,
            textAlign: "center",
          }}
        >
<<<<<<< HEAD
          {t("login.description")}
=======
          Hesabınıza erişmek için bilgilerinizi girin.
>>>>>>> 2742bcc (ilk yükleme)
        </Text>
      </View>

      {/* Form */}
      <LinearGradient
        colors={theme.formcardgradient as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: dimensions.borderRadiusXL,
          padding: wp(6),
        }}
      >
        <View>
          {/* Email Field */}
          <View style={{ marginBottom: hp(2) }}>
            <Text
              style={{
                marginBottom: hp(1),
                fontSize: dimensions.fontMD,
                fontWeight: "medium",
                color: theme.inputtitle,
              }}
            >
<<<<<<< HEAD
              {t("login.emailLabel")}
=======
              E-posta Adresi
>>>>>>> 2742bcc (ilk yükleme)
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <View>
                  <TextInput
                    style={{
                      borderRadius: dimensions.borderRadiusLG,
                      borderWidth: 1,
                      padding: wp(4.5),
                      backgroundColor: theme.input,
                      borderColor: errors.email ? theme.error : theme.border,
                    }}
<<<<<<< HEAD
                    placeholder={t("login.emailPlaceholder")}
=======
                    placeholder="ornek@email.com"
>>>>>>> 2742bcc (ilk yükleme)
                    placeholderTextColor={theme.inputplaceholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    editable={!isSubmitting && !isLoggingIn}
                  />
                  {errors.email && (
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: dimensions.fontXS,
                        color: theme.error,
                      }}
                    >
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Password Field */}
          <View style={{ marginBottom: hp(2) }}>
            <Text
              style={{
                marginBottom: hp(1),
                fontSize: dimensions.fontMD,
                fontWeight: "medium",
                color: theme.inputtitle,
              }}
            >
<<<<<<< HEAD
              {t("login.passwordLabel")}
=======
              Şifre
>>>>>>> 2742bcc (ilk yükleme)
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <View>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      style={{
                        borderRadius: dimensions.borderRadiusLG,
                        borderWidth: 1,
                        paddingVertical: wp(4),
                        paddingHorizontal: wp(4.5),
                        backgroundColor: theme.input,
                        borderColor: errors.password
                          ? theme.error
                          : theme.border,
                      }}
<<<<<<< HEAD
                      placeholder={t("login.passwordPlaceholder")}
=======
                      placeholder="Şifrenizi girin"
>>>>>>> 2742bcc (ilk yükleme)
                      placeholderTextColor={theme.inputplaceholder}
                      secureTextEntry={!showPassword}
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      editable={!isSubmitting && !isLoggingIn}
                      autoComplete="password"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: wp(4.5),
                        top: wp(4.5),
                      }}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting || isLoggingIn}
                      accessibilityLabel={
<<<<<<< HEAD
                        showPassword ? t("login.hidePassword") : t("login.showPassword")
=======
                        showPassword ? "Şifreyi gizle" : "Şifreyi göster"
>>>>>>> 2742bcc (ilk yükleme)
                      }
                      accessibilityRole="button"
                    >
                      <Feather
                        name={showPassword ? "eye-off" : "eye"}
                        size={dimensions.iconMD}
                        color={theme.passwordicon}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: dimensions.fontXS,
                        color: theme.error,
                      }}
                    >
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Forgot Password Link */}
          <View style={{ marginBottom: hp(2), alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={() => router.replace("/(screens)/(auth)/email-control")}
              activeOpacity={1}
            >
              <Text
                style={{
                  fontSize: dimensions.fontMD - 0.5,
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                  color: theme.link,
                }}
              >
<<<<<<< HEAD
                {t("login.forgotPassword")}
=======
                Şifremi Unuttum
>>>>>>> 2742bcc (ilk yükleme)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            disabled={isSubmitting || isLoggingIn}
            onPress={handleSubmit((data) => login(data), resetLogin)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: dimensions.borderRadiusXL,
              paddingVertical: wp(4.5),
              backgroundColor: theme.buttonsecondary,
            }}
            activeOpacity={0.8}
            accessibilityState={{ disabled: isSubmitting || isLoggingIn }}
          >
            {(isSubmitting || isLoggingIn) && (
              <ActivityIndicator
                color={theme.loader}
                size="small"
                style={{ marginRight: wp(2) }}
              />
            )}
            <Text
              style={{
                fontSize: dimensions.fontLG,
                fontWeight: "semibold",
                color: theme.text,
                textAlign: "center",
              }}
            >
<<<<<<< HEAD
              {isSubmitting || isLoggingIn ? t("login.buttonLoading") : t("login.button")}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: hp(1),
              justifyContent: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1.5,
                backgroundColor: theme.border,
                borderRadius: 2,
                marginRight: wp(2),
              }}
            />
            <Text
              style={{
                fontSize: dimensions.fontXS,
                color: theme.textQuaternary,
                textAlign: "center",
                paddingHorizontal: wp(1.5),
                fontWeight: "600",
                letterSpacing: 0.4,
              }}
            >
              {t("register.or")}
            </Text>
            <View
              style={{
                flex: 1,
                height: 1.5,
                backgroundColor: theme.border,
                borderRadius: 2,
                marginLeft: wp(2),
              }}
            />
          </View>
          <GoogleSignIn text={t("login.googleLogin")} />
=======
              {isSubmitting || isLoggingIn ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Text>
          </TouchableOpacity>
          <GoogleSignIn text="Google ile Giriş Yap" />
>>>>>>> 2742bcc (ilk yükleme)

          {/* Sign Up Link */}
          <View
            style={{
              marginTop: hp(2),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: hp(2),
            }}
          >
            <Text
              style={{
                fontSize: dimensions.fontMD - 0.5,
                color: theme.textQuaternary,
              }}
            >
<<<<<<< HEAD
              {t("login.noAccount")}{" "}
=======
              Hesabın yok mu?{" "}
>>>>>>> 2742bcc (ilk yükleme)
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.replace("/(screens)/(auth)/register" as never)
              }
              activeOpacity={1}
            >
              <Text
                style={{
                  fontSize: dimensions.fontMD - 0.5,
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                  color: theme.link,
                }}
              >
<<<<<<< HEAD
                {t("login.createAccount")}
=======
                Hesap Oluştur
>>>>>>> 2742bcc (ilk yükleme)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
