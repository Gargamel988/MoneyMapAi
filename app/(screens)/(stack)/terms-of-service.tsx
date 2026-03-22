import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../src/contexts/theme';
import { useResponsive } from '../../../src/hooks/useResponsive';

export default function TermsOfService() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions, wp } = useResponsive();

  const openMail = (mail: string) => Linking.openURL(`mailto:${mail}`).catch(() => { });

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
          {t("termsOfService.title")}
        </Text>

        <Text
          style={{
            color: theme.textQuaternary,
            fontStyle: 'italic',
            marginBottom: dimensions.lg,
            fontSize: dimensions.fontSM,
          }}
        >
          {t("termsOfService.lastUpdated")}
        </Text>

        <Text style={{ lineHeight: 22, marginBottom: dimensions.md, color: theme.textSenary }}>
          {t("termsOfService.intro")}
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
          <Text style={{ color: theme.textSenary, fontSize: dimensions.fontXL, fontWeight: '700', marginBottom: dimensions.sm }}>
            {t("termsOfService.important.title")}
          </Text>
          <Text style={{ marginBottom: 0, lineHeight: 22, color: theme.textSenary }}>
            {t("termsOfService.important.text")}
          </Text>
        </View>

        {/* License to Use */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.license.title")}
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          {t("termsOfService.license.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.license.download")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.license.tracking")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.license.receipts")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.license.reports")}</Text>
        </View>

        <View
          style={{
            backgroundColor: theme.profilecardbackground,
            padding: dimensions.md,
            borderLeftWidth: 4,
            borderLeftColor: theme.error,
            borderRadius: dimensions.borderRadius,
            marginVertical: dimensions.md,
          }}
        >
          <Text style={{ margin: 0, lineHeight: 22, color: theme.textSenary }}>
            {t("termsOfService.license.prohibited")}
          </Text>
        </View>

        {/* User Responsibilities */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.responsibilities.title")}
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          {t("termsOfService.responsibilities.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.responsibilities.accuracy")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.responsibilities.security")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.responsibilities.backup")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.responsibilities.legal")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.responsibilities.camera")}</Text>
        </View>

        {/* AI and Data Processing */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.ai.title")}
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          {t("termsOfService.ai.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.ai.ocr")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.ai.categorization")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.ai.accuracy")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.ai.learning")}</Text>
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
          <Text style={{ margin: 0, lineHeight: 22, color: theme.textSenary }}>
            {t("termsOfService.ai.note")}
          </Text>
        </View>

        {/* Data Ownership */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.dataOwnership.title")}
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          {t("termsOfService.dataOwnership.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.dataOwnership.photos")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.dataOwnership.records")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.dataOwnership.export")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.dataOwnership.delete")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.dataOwnership.marketing")}</Text>
        </View>

        {/* Service Availability */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.availability.title")}
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          {t("termsOfService.availability.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.availability.maintenance")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.availability.technical")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.availability.internet")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.availability.thirdParty")}</Text>
        </View>

        {/* Disclaimers */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.disclaimer.title")}
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          {t("termsOfService.disclaimer.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.disclaimer.advice")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.disclaimer.accuracy")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.disclaimer.dataLoss")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.disclaimer.thirdParty")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.disclaimer.compatibility")}</Text>
        </View>

        {/* Limitation of Liability */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.liability.title")}
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          {t("termsOfService.liability.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.liability.financial")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.liability.errors")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.liability.dataLoss")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.liability.thirdParty")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.liability.connection")}</Text>
        </View>

        {/* Age Restrictions */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.age.title")}
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          {t("termsOfService.age.text")}
        </Text>

        {/* Updates and Changes */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.updates.title")}
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          {t("termsOfService.updates.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.updates.update")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.updates.features")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.updates.terms")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.updates.stop")}</Text>
        </View>

        {/* Termination */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.termination.title")}
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          {t("termsOfService.termination.intro")}
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.termination.violation")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.termination.illegal")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.termination.harm")}</Text>
          <Text style={{ color: theme.textSenary }}>â€¢ {t("termsOfService.termination.fake")}</Text>
        </View>

        {/* Governing Law */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.law.title")}
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          {t("termsOfService.law.text")}
        </Text>

        {/* Intellectual Property */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.intellectual.title")}
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          {t("termsOfService.intellectual.text")}
        </Text>

        {/* Entire Agreement */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          {t("termsOfService.agreement.title")}
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          {t("termsOfService.agreement.text")}
        </Text>

        {/* Effective Date */}
        <View
          style={{
            backgroundColor: theme.profilecardbackground,
            padding: dimensions.md,
            borderLeftWidth: 4,
            borderLeftColor: theme.summarycardborder,
            borderRadius: dimensions.borderRadius,
            marginVertical: dimensions.lg,
          }}
        >
          <Text style={{ margin: 0, lineHeight: 22, color: theme.textSenary }}>
            {t("termsOfService.effectiveDate")}
          </Text>
        </View>

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
            {t("termsOfService.contact.title")}
          </Text>
          <Text style={{ lineHeight: 22, marginBottom: dimensions.xs, color: theme.white }}>
            {t("termsOfService.contact.text")}
          </Text>
          <TouchableOpacity onPress={() => openMail('gargamel9288@gmail.com')} activeOpacity={0.7}>
            <Text style={{ color: theme.textPrimary, fontWeight: '700', textDecorationLine: 'underline' }}>
              {t("termsOfService.contact.email")}
            </Text>
          </TouchableOpacity>
          <Text style={{ marginTop: dimensions.sm, marginBottom: 0, color: theme.white }}>
            <Text style={{ fontWeight: '700' }}>{t("termsOfService.contact.appName")}:</Text> {t("termsOfService.contact.appName")}
          </Text>
          <Text style={{ color: theme.white }}>
            <Text style={{ fontWeight: '700' }}>{t("termsOfService.contact.developer")}:</Text> {t("termsOfService.contact.developer")}
          </Text>
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
          {t("termsOfService.footer")}
        </Text>
      </View>
    </ScrollView>
  );
}
