import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../src/contexts/theme';
import { useResponsive } from '../../../src/hooks/useRespons';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions, wp } = useResponsive();

  const openUrl = (url: string) => Linking.openURL(url).catch(() => {});
  const openMail = (mail: string) => Linking.openURL(`mailto:${mail}`).catch(() => {});

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: dimensions.lg,
        paddingTop: dimensions.lg,
        paddingBottom: dimensions.xl,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          width: wp(94),
          alignSelf: 'center',
          backgroundColor: theme.weeklycard,
          borderRadius: dimensions.borderRadiusXL,
          padding: dimensions.xl,
          borderWidth: 1,
          borderColor: theme.bordersecondary,
        }}
      >
        {/* Header */}
        <Text
          style={{
            color: theme.textSenary,
            borderBottomWidth: 3,
            borderBottomColor: theme.summarycardborder,
            paddingBottom: dimensions.sm,
            fontSize: dimensions.fontLarge,
            fontWeight: '800',
            marginBottom: dimensions.xs,
          }}
        >
          {t("privacyPolicy.title")}
        </Text>

        <Text
          style={{
            color: theme.textQuaternary,
            fontStyle: 'italic',
            marginBottom: dimensions.lg,
            fontSize: dimensions.fontSM,
          }}
        >
          {t("privacyPolicy.lastUpdated")}
        </Text>

        <Text style={{ color: theme.textSenary, lineHeight: 22, marginBottom: dimensions.md }}>
          {t("privacyPolicy.intro")}
        </Text>

        {/* Important Notice */}
        <View
          style={{
            backgroundColor: theme.cluebackground,
            padding: dimensions.md,
            borderLeftWidth: 4,
            borderLeftColor: theme.buttontertiary,
            borderRadius: dimensions.borderRadius,
            marginBottom: dimensions.lg,
          }}
        >
          <Text
            style={{
              color: theme.textSenary,
              fontSize: dimensions.fontXL,
              fontWeight: '700',
              marginBottom: dimensions.sm,
            }}
          >
            {t("privacyPolicy.camera.title")}
          </Text>

          <Text style={{ color: theme.textSenary, marginBottom: dimensions.sm }}>
            <Text style={{ fontWeight: '700' }}>{t("privacyPolicy.camera.permission")}</Text>
          </Text>

          <View style={{ gap: dimensions.xs, marginBottom: dimensions.md }}>
            <Text style={{ color: theme.textSenary }}>
              • <Text style={{ fontWeight: '700' }}>{t("privacyPolicy.camera.receipt")}</Text>
            </Text>
            <Text style={{ color: theme.textSenary }}>
              • <Text style={{ fontWeight: '700' }}>{t("privacyPolicy.camera.ai")}</Text>
            </Text>
          </View>

          <Text style={{ color: theme.textSenary, marginBottom: dimensions.xs, fontWeight: '700' }}>
            {t("privacyPolicy.camera.privacy")}
          </Text>
          <View style={{ gap: dimensions.xs }}>
            <Text style={{ color: theme.textSenary }}>✓ {t("privacyPolicy.camera.point1")}</Text>
            <Text style={{ color: theme.textSenary }}>
              ✓ {t("privacyPolicy.camera.point2")}
            </Text>
            <Text style={{ color: theme.textSenary }}>✓ {t("privacyPolicy.camera.point3")}</Text>
            <Text style={{ color: theme.textSenary }}>✓ {t("privacyPolicy.camera.point4")}</Text>
            <Text style={{ color: theme.textSenary }}>✓ {t("privacyPolicy.camera.point5")}</Text>
          </View>
        </View>

        {/* Information Collection */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          {t("privacyPolicy.collection.title")}
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22, marginBottom: dimensions.sm }}>
          {t("privacyPolicy.collection.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• {t("privacyPolicy.collection.ip")}</Text>
          <Text style={{ color: theme.textSenary }}>
            • {t("privacyPolicy.collection.pages")}
          </Text>
          <Text style={{ color: theme.textSenary }}>• {t("privacyPolicy.collection.time")}</Text>
          <Text style={{ color: theme.textSenary }}>• {t("privacyPolicy.collection.os")}</Text>
          <Text style={{ color: theme.textSenary }}>• {t("privacyPolicy.collection.photos")}</Text>
          <Text style={{ color: theme.textSenary }}>
            • {t("privacyPolicy.collection.ai")}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: theme.profilecardbackground,
            padding: dimensions.md,
            borderLeftWidth: 4,
            borderLeftColor: theme.summarycardborder,
            borderRadius: dimensions.borderRadius,
            marginVertical: dimensions.md,
          }}
        >
          <Text style={{ margin: 0, color: theme.textSenary }}>
            {t("privacyPolicy.collection.note")}
          </Text>
        </View>

        {/* AI Usage */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          {t("privacyPolicy.ai.title")}
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22, marginBottom: dimensions.sm }}>
          {t("privacyPolicy.ai.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• {t("privacyPolicy.ai.ocr")}</Text>
          <Text style={{ color: theme.textSenary }}>• {t("privacyPolicy.ai.extract")}</Text>
          <Text style={{ color: theme.textSenary }}>
            • {t("privacyPolicy.ai.delete")}
          </Text>
          <Text style={{ color: theme.textSenary }}>
            • {t("privacyPolicy.ai.thirdParty")}
          </Text>
        </View>

        {/* Third Party Access */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          {t("privacyPolicy.thirdParty.title")}
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22, marginBottom: dimensions.sm }}>
          {t("privacyPolicy.thirdParty.intro")}
        </Text>
        <TouchableOpacity onPress={() => openUrl('https://policies.google.com/privacy')} activeOpacity={0.7}>
          <Text style={{ color: theme.link, textDecorationLine: 'underline' }}>{t("privacyPolicy.thirdParty.google")}</Text>
        </TouchableOpacity>

        {/* Opt-out Rights */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          {t("privacyPolicy.optOut.title")}
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          {t("privacyPolicy.optOut.text")}
        </Text>

        {/* Data Retention */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          {t("privacyPolicy.retention.title")}
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          {t("privacyPolicy.retention.text")}
        </Text>

        {/* Children */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          {t("privacyPolicy.children.title")}
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          {t("privacyPolicy.children.text")}
        </Text>

        {/* Security */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          {t("privacyPolicy.security.title")}
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          {t("privacyPolicy.security.text")}
        </Text>

        {/* Changes */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          {t("privacyPolicy.changes.title")}
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          {t("privacyPolicy.changes.text1")}
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          <Text style={{ fontWeight: '700' }}>{t("privacyPolicy.changes.text2")}</Text>
        </Text>

        {/* Consent */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          {t("privacyPolicy.consent.title")}
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          {t("privacyPolicy.consent.text")}
        </Text>

        {/* Contact */}
        <View
          style={{
            backgroundColor: theme.headerbackground,
            padding: dimensions.lg,
            borderRadius: dimensions.borderRadiusLG,
            marginTop: dimensions.xl,
          }}
        >
          <Text style={{ color: theme.white, fontSize: dimensions.fontXL, fontWeight: '700', marginBottom: dimensions.xs }}>
            {t("privacyPolicy.contact.title")}
          </Text>
          <Text style={{ color: theme.white, lineHeight: 22, marginBottom: dimensions.xs }}>
            {t("privacyPolicy.contact.text")}
          </Text>
          <TouchableOpacity onPress={() => openMail('gargamel9288@gmail.com')} activeOpacity={0.7}>
            <Text style={{ color: theme.textPrimary, fontWeight: '700', textDecorationLine: 'underline' }}>
              {t("privacyPolicy.contact.email")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text
          style={{
            marginTop: dimensions.lg,
            color: theme.textQuinary,
            fontSize: dimensions.fontSM,
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          {t("privacyPolicy.footer")}
        </Text>
      </View>
    </ScrollView>
  );
}