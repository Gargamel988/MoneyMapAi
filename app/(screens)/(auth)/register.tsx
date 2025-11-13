import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
<<<<<<< HEAD
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
=======
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
>>>>>>> 2742bcc (ilk yükleme)
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleSignIn from "../../../src/components/googleauth";
import { useTheme } from "../../../src/contexts/theme";
import { useResponsive } from "../../../src/hooks/useRespons";
import { useAuthsignupMutation } from "../../../src/lib/authmutation";
import {
  RegisterFormData,
<<<<<<< HEAD
  calculatePasswordStrength,
=======
>>>>>>> 2742bcc (ilk yükleme)
  registerSchemas,
} from "../../../src/schemas/RegisterSchema";

export default function Register() {
  const { theme } = useTheme();
  const { hp, wp, dimensions } = useResponsive();
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const { t } = useTranslation();
=======
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
>>>>>>> 2742bcc (ilk yükleme)

  const { register, isRegistering, resetRegister } = useAuthsignupMutation();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
<<<<<<< HEAD
    watch,
=======
>>>>>>> 2742bcc (ilk yükleme)
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchemas),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
<<<<<<< HEAD
    },
  });

  const password = watch("password");

  const passwordStrength = calculatePasswordStrength(password);

=======
      confirmPassword: "",
    },
  });

>>>>>>> 2742bcc (ilk yükleme)
  return (
    <SafeAreaView
      style={{
        flex: 1,

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
          {t("register.title")}
=======
          Hesap Oluştur
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
          {t("register.description")}
=======
          Finansal yolculuğunuza başlamak için bilgilerinizi girin.
>>>>>>> 2742bcc (ilk yükleme)
        </Text>
      </View>

      {/* Form */}
      <LinearGradient
        colors={theme.formcardgradient as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: dimensions.borderRadiusXL, padding: wp(6) }}
      >
<<<<<<< HEAD
=======
        <View>
>>>>>>> 2742bcc (ilk yükleme)
          {/* Name Row */}
          <View
            style={{ marginBottom: hp(2), flexDirection: "row", gap: wp(3) }}
          >
            <View style={{ width: "50%" }}>
              <Text
                style={{
                  marginBottom: hp(1),
                  fontSize: dimensions.fontMD,
                  fontWeight: "medium",
                  color: theme.inputtitle,
                }}
              >
<<<<<<< HEAD
                {t("register.firstName")}
=======
                Ad
>>>>>>> 2742bcc (ilk yükleme)
              </Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <View>
                    <TextInput
                      style={{
                        width: "100%",
                        borderRadius: dimensions.borderRadiusLG,
                        borderWidth: 1,
                        padding: wp(4.5),
                        backgroundColor: theme.input,
                        borderColor: errors.firstName
                          ? theme.error
                          : theme.border,
                      }}
<<<<<<< HEAD
                      placeholder={t("register.firstNamePlaceholder")}
=======
                      placeholder="Adınız"
>>>>>>> 2742bcc (ilk yükleme)
                      placeholderTextColor={theme.inputplaceholder}
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      editable={!isSubmitting || !isRegistering}
<<<<<<< HEAD
                      accessibilityLabel={t("register.firstName")}
                      accessibilityHint={t("register.firstNameHint")}
=======
                      accessibilityLabel="Ad"
                      accessibilityHint="Adınızı girin"
>>>>>>> 2742bcc (ilk yükleme)
                      autoCapitalize="words"
                      autoCorrect={false}
                      textContentType="givenName"
                      autoComplete="given-name"
                    />
                    {errors.firstName && (
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: dimensions.fontXS - 0.7,
                          color: theme.error,
                        }}
                      >
                        {errors.firstName.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  marginBottom: hp(1),
                  fontSize: dimensions.fontMD,
                  fontWeight: "medium",
                  color: theme.inputtitle,
                }}
              >
<<<<<<< HEAD
                {t("register.lastName")}
=======
                Soyad
>>>>>>> 2742bcc (ilk yükleme)
              </Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <View>
                    <TextInput
                      style={{
                        width: "100%",
                        borderRadius: dimensions.borderRadiusLG,
                        borderWidth: 1,
                        padding: wp(4.5),
                        backgroundColor: theme.input,
                        borderColor: errors.lastName
                          ? theme.error
                          : theme.border,
                      }}
<<<<<<< HEAD
                      placeholder={t("register.lastNamePlaceholder")}
=======
                      placeholder="Soyadınız"
>>>>>>> 2742bcc (ilk yükleme)
                      placeholderTextColor={theme.inputplaceholder}
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      editable={!isSubmitting || !isRegistering}
<<<<<<< HEAD
                      accessibilityLabel={t("register.lastName")}
                      accessibilityHint={t("register.lastNameHint")}
=======
                      accessibilityLabel="Soyad"
                      accessibilityHint="Soyadınızı girin"
>>>>>>> 2742bcc (ilk yükleme)
                      autoCapitalize="words"
                      autoCorrect={false}
                      textContentType="familyName"
                      autoComplete="family-name"
                    />
                    {errors.lastName && (
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: dimensions.fontXS - 1.7,
                          color: theme.error,
                        }}
                      >
                        {errors.lastName.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          {/* Email */}
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
              {t("register.email")}
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
                    placeholder={t("register.emailPlaceholder")}
=======
                    placeholder="ornek@email.com"
>>>>>>> 2742bcc (ilk yükleme)
                    placeholderTextColor={theme.inputplaceholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    editable={!isSubmitting || !isRegistering}
<<<<<<< HEAD
                    accessibilityLabel={t("register.email")}
                    accessibilityHint={t("register.emailHint")}
=======
                    accessibilityLabel="E-posta"
                    accessibilityHint="E-posta adresinizi girin"
>>>>>>> 2742bcc (ilk yükleme)
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

          {/* Password */}
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
              {t("register.password")}
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
                        padding: wp(4.5),
                        backgroundColor: theme.input,
                        borderColor: errors.password
                          ? theme.error
                          : theme.border,
                      }}
<<<<<<< HEAD
                      placeholder={t("register.passwordPlaceholder")}
=======
                      placeholder="En az 6 karakter"
>>>>>>> 2742bcc (ilk yükleme)
                      placeholderTextColor={theme.inputplaceholder}
                      secureTextEntry={!showPassword}
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      editable={!isSubmitting || !isRegistering}
<<<<<<< HEAD
                      accessibilityLabel={t("register.password")}
                      accessibilityHint={t("register.passwordHint")}
=======
                      accessibilityLabel="Şifre"
                      accessibilityHint="Şifrenizi girin"
>>>>>>> 2742bcc (ilk yükleme)
                      autoComplete="new-password"
                      textContentType="newPassword"
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
                      disabled={isSubmitting || isRegistering}
                      accessibilityLabel={
                        showPassword ? "Şifreyi gizle" : "Şifreyi göster"
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
<<<<<<< HEAD
                  <View style={{ marginBottom: hp(1) }}>
                    {passwordStrength.score > 0 && (
                      <View style={{ flexDirection: "row", gap: wp(1) }}>
                        <Text
                          style={{
                            fontSize: dimensions.fontXS,
                            color: passwordStrength.color,
                          }}
                        >
                          {t("register.passwordStrength")}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: wp(60),
                            borderRadius: dimensions.borderRadiusLG,
                            padding: wp(1),
                          }}
                        >
                          <View
                            style={{
                              width: passwordStrength.width,
                              height: wp(1),
                              backgroundColor: passwordStrength.color,
                              borderRadius: dimensions.borderRadiusLG,
                            }}
                          />
                        </View>
                      </View>
                    )}
                    {passwordStrength.score > 0 && (
                      <View style={{ marginTop: hp(1) }}>
                      <Text
                        style={{
                          fontSize: dimensions.fontXS,
                          color: theme.error,
                        }}
                      >
                         {passwordStrength.feedback[1]}
                      </Text>
                      </View>
                    )}
                  </View>
=======

>>>>>>> 2742bcc (ilk yükleme)
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

<<<<<<< HEAD
=======
          {/* Confirm Password */}
          <View style={{ marginBottom: hp(2) }}>
            <Text
              style={{
                marginBottom: hp(1),
                fontSize: dimensions.fontMD,
                fontWeight: "medium",
                color: theme.inputtitle,
              }}
            >
              Şifre Onayı
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <View>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      style={{
                        borderRadius: dimensions.borderRadiusLG,
                        borderWidth: 1,
                        padding: wp(4.5),
                        backgroundColor: theme.input,
                        borderColor: errors.confirmPassword
                          ? theme.error
                          : theme.border,
                      }}
                      placeholder="Şifrenizi tekrar girin"
                      placeholderTextColor={theme.inputplaceholder}
                      secureTextEntry={!showConfirmPassword}
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      editable={!isSubmitting || !isRegistering}
                      accessibilityLabel="Şifre Onayı"
                      accessibilityHint="Şifrenizi tekrar girin"
                      autoComplete="new-password"
                      textContentType="newPassword"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: wp(4.5),
                        top: wp(4.5),
                      }}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isSubmitting || isRegistering}
                      accessibilityLabel={
                        showConfirmPassword
                          ? "Şifre onayını gizle"
                          : "Şifre onayını göster"
                      }
                      accessibilityRole="button"
                    >
                      <Feather
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={dimensions.iconMD}
                        color={theme.passwordicon}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && (
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: dimensions.fontXS,
                        color: theme.error,
                      }}
                    >
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

>>>>>>> 2742bcc (ilk yükleme)
          {/* Terms and Privacy Notice */}
          <View style={{ marginBottom: hp(2), paddingHorizontal: wp(2) }}>
            <Text
              style={{
                fontSize: dimensions.fontXS,
                lineHeight: 18,
                color: theme.textTertiary,
                textAlign: "center",
              }}
            >
<<<<<<< HEAD
              {t("register.termsAndPrivacyNotice.1")} {" "}
              <Link
                href="/(screens)/(stack)/terms-of-service"
                asChild
                style={{ textDecorationLine: "underline", color: theme.link }}
              >
                <Text>{t("register.termsAndPrivacyNotice.2")}</Text>
              </Link>{" "}
              {t("register.termsAndPrivacyNotice.3")} {" "}
              <Link
                href="/(screens)/(stack)/privacy-policy"
                asChild
                style={{ textDecorationLine: "underline", color: theme.link }}
              >
                <Text>{t("register.termsAndPrivacyNotice.4")}</Text>
              </Link>{" "}
              {t("register.termsAndPrivacyNotice.5")}
=======
              Kayıt olarak{" "}
              <Text
                style={{ textDecorationLine: "underline", color: theme.link }}
              >
                Kullanım Şartları
              </Text>{" "}
              ve{" "}
              <Text
                style={{ textDecorationLine: "underline", color: theme.link }}
              >
                Gizlilik Politikası
              </Text>
              &apos;nı kabul etmiş olursunuz.
>>>>>>> 2742bcc (ilk yükleme)
            </Text>
          </View>

          {/* Sign Up Button */}

          <TouchableOpacity
            disabled={isSubmitting || isRegistering}
            onPress={handleSubmit(
              (data) =>
                register({
                  email: data.email,
                  password: data.password,
                  first_name: data.firstName,
                  last_name: data.lastName,
                }),
              resetRegister
            )}
            style={{
<<<<<<< HEAD
=======
            
>>>>>>> 2742bcc (ilk yükleme)
              borderRadius: dimensions.borderRadiusXL,
              paddingVertical: wp(4.5),
              backgroundColor: theme.buttonsecondary,
            }}
            activeOpacity={0.8}
<<<<<<< HEAD
            accessibilityLabel={t("register.registerButton")}
=======
            accessibilityLabel="Kayıt ol"
>>>>>>> 2742bcc (ilk yükleme)
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting || isRegistering }}
          >
            {(isSubmitting || isRegistering) && (
              <ActivityIndicator
                color={theme.loader}
                size="small"
                style={{ marginRight: wp(2) }}
              />
            )}
            <Text
              style={{
                fontSize: dimensions.fontLG,
                textAlign: "center",
                fontWeight: "semibold",
                color: theme.text,
              }}
            >
              {isSubmitting || isRegistering
<<<<<<< HEAD
                ? t("register.registerButtonLoading")
                : t("register.registerButton")}
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
          <GoogleSignIn text={t("register.googleRegister")} />
=======
                ? "Kayıt Oluşturuluyor..."
                : "Kayıt Ol"}
            </Text>
          </TouchableOpacity>
          <GoogleSignIn text="Google ile Kayıt Ol" />
        </View>
>>>>>>> 2742bcc (ilk yükleme)

        {/* Login Link */}
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
              fontSize: dimensions.fontMD,
              color: theme.textQuaternary,
            }}
          >
<<<<<<< HEAD
            {t("login.link")} {" "}
=======
            Zaten hesabınız var mı?{" "}
>>>>>>> 2742bcc (ilk yükleme)
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(screens)/(auth)/login" as never)}
            activeOpacity={1}
<<<<<<< HEAD
=======
        
>>>>>>> 2742bcc (ilk yükleme)
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
              {t("login.button")}
=======
              Giriş Yap
>>>>>>> 2742bcc (ilk yükleme)
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
