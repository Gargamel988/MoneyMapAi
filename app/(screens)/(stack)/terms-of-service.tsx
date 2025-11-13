import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../src/contexts/theme';
import { useResponsive } from '../../../src/hooks/useRespons';

export default function TermsOfService() {
  const { theme } = useTheme();
  const { dimensions, wp } = useResponsive();

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
          Kullanım Şartları
        </Text>

        <Text
          style={{
            color: theme.textQuaternary,
            fontStyle: 'italic',
            marginBottom: dimensions.lg,
            fontSize: dimensions.fontSM,
          }}
        >
          Son güncelleme: 31 Ekim 2025
        </Text>

        <Text style={{ lineHeight: 22, marginBottom: dimensions.md, color: theme.textSenary }}>
          <Text style={{ fontWeight: '700' }}>MoneyMapAi</Text> mobil uygulamasını kullanmadan önce lütfen bu kullanım şartlarını dikkatlice
          okuyunuz. Uygulamayı indirerek veya kullanarak, bu şartları kabul etmiş sayılırsınız.
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
            ⚠️ Önemli Bilgilendirme
          </Text>
          <Text style={{ marginBottom: 0, lineHeight: 22, color: theme.textSenary }}>
            Bu uygulama finansal tavsiye, muhasebe veya vergi danışmanlığı hizmeti sağlamaz. Uygulamadaki veriler yalnızca kişisel finansal
            takip amacıyla kullanılmalıdır. Resmi mali işlemler için profesyonel bir muhasebeci veya mali müşavirle görüşmeniz önerilir.
          </Text>
        </View>

        {/* License to Use */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          1. Lisans ve Kullanım Hakları
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          ömer (Hizmet Sağlayıcı), size kişisel, ticari olmayan, devredilemez, münhasır olmayan bir lisans vermektedir. Bu lisans yalnızca şu
          amaçlarla geçerlidir:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• Uygulamayı kişisel cihazınıza indirmek ve yüklemek</Text>
          <Text style={{ color: theme.textSenary }}>• Kişisel finansal takibiniz için kullanmak</Text>
          <Text style={{ color: theme.textSenary }}>• Fatura ve makbuzlarınızı kaydetmek ve analiz etmek</Text>
          <Text style={{ color: theme.textSenary }}>• Harcama raporları ve istatistikler oluşturmak</Text>
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
            <Text style={{ fontWeight: '700' }}>Yasak Kullanımlar:</Text> Uygulamayı kopyalamak, değiştirmek, tersine mühendislik yapmak,
            kaynak kodunu çıkarmak, satmak, dağıtmak veya türev çalışmalar oluşturmak kesinlikle yasaktır.
          </Text>
        </View>

        {/* User Responsibilities */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          2. Kullanıcı Sorumlulukları
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          Uygulamayı kullanırken şu sorumluluklara sahipsiniz:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Doğru Bilgi:</Text> Girdiğiniz finansal verilerin doğruluğundan siz sorumlusunuz</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Güvenlik:</Text> Hesap bilgilerinizi ve cihazınızı güvende tutmalısınız</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Yedekleme:</Text> Önemli verilerinizi düzenli olarak yedeklemelisiniz</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Yasal Uyum:</Text> Uygulamayı yasalara uygun şekilde kullanmalısınız</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Kamera İzni:</Text> Kamera iznini yalnızca fatura/makbuz çekmek için kullanmalısınız</Text>
        </View>

        {/* AI and Data Processing */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          3. Yapay Zeka ve Veri İşleme
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          MoneyMapAi, fatura ve makbuz analizi için yapay zeka teknolojisi kullanır:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>OCR Teknolojisi:</Text> Fotoğraflarınız metin tanıma ile işlenir</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Otomatik Kategorizasyon:</Text> Harcamalarınız AI tarafından otomatik olarak kategorize edilir</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Doğruluk:</Text> AI analizi yüzde yüz doğru olmayabilir, sonuçları kontrol etmeniz önerilir</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Öğrenme:</Text> Sistem zamanla sizin düzeltmelerinizden öğrenerek gelişir</Text>
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
            <Text style={{ fontWeight: '700' }}>Not:</Text> AI analizinin sonuçları yalnızca yardımcı amaçlıdır. Kritik finansal kararlar için mutlaka
            verileri manuel olarak kontrol edin.
          </Text>
        </View>

        {/* Data Ownership */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          4. Veri Sahipliği ve Kontrol
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          Uygulamaya yüklediğiniz tüm veriler size aittir:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• Fatura ve makbuz fotoğraflarınızın sahibi sizsiniz</Text>
          <Text style={{ color: theme.textSenary }}>• Harcama kayıtlarınız ve notlarınız size aittir</Text>
          <Text style={{ color: theme.textSenary }}>• Verilerinizi istediğiniz zaman dışa aktarabilirsiniz</Text>
          <Text style={{ color: theme.textSenary }}>• Hesabınızı ve tüm verilerinizi istediğiniz zaman silebilirsiniz</Text>
          <Text style={{ color: theme.textSenary }}>• Hizmet Sağlayıcı verilerinizi pazarlama veya reklam amaçlı kullanmaz</Text>
        </View>

        {/* Service Availability */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          5. Hizmet Kullanılabilirliği
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          Hizmet Sağlayıcı, uygulamanın kesintisiz veya hatasız çalışacağını garanti etmez. Aşağıdaki durumlarda hizmet kesintisi yaşanabilir:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• Planlı bakım ve güncellemeler</Text>
          <Text style={{ color: theme.textSenary }}>• Teknik arızalar ve sunucu sorunları</Text>
          <Text style={{ color: theme.textSenary }}>• İnternet bağlantısı kesintileri</Text>
          <Text style={{ color: theme.textSenary }}>• Üçüncü taraf servislerdeki aksaklıklar</Text>
        </View>

        {/* Disclaimers */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          6. Sorumluluk Reddi
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          Uygulama OLDUĞU GİBİ ve MEVCUT OLDUĞU HALDE sunulmaktadır:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Finansal Tavsiye Değil:</Text> Uygulama finansal tavsiye veya yatırım önerisi içermez</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Doğruluk Garantisi Yok:</Text> AI analiz sonuçlarının yüzde yüz doğru olacağı garanti edilmez</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Veri Kaybı:</Text> Teknik sorunlar nedeniyle veri kaybı yaşanabilir (düzenli yedekleme önerilir)</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Üçüncü Taraf Servisler:</Text> Entegre servislerin performansından sorumlu değiliz</Text>
          <Text style={{ color: theme.textSenary }}>• <Text style={{ fontWeight: '700' }}>Cihaz Uyumluluğu:</Text> Tüm cihazlarda aynı performansta çalışmayabilir</Text>
        </View>

        {/* Limitation of Liability */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          7. Sorumluluk Sınırlaması
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          Yasaların izin verdiği ölçüde, Hizmet Sağlayıcı aşağıdakilerden sorumlu değildir:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• Uygulamanın kullanımından kaynaklanan mali kayıplar</Text>
          <Text style={{ color: theme.textSenary }}>• Yanlış veri girişi veya AI analizinden kaynaklanan hatalar</Text>
          <Text style={{ color: theme.textSenary }}>• Veri kaybı veya veri bozulması</Text>
          <Text style={{ color: theme.textSenary }}>• Üçüncü taraf servislerin sebep olduğu sorunlar</Text>
          <Text style={{ color: theme.textSenary }}>• İnternet bağlantısı veya cihaz kaynaklı problemler</Text>
        </View>

        {/* Age Restrictions */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          8. Yaş Sınırlaması
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          MoneyMapAi uygulaması 13 yaş ve üzeri kullanıcılar içindir. 13 yaşından küçükseniz, uygulamayı ebeveyn veya vasi izni ve gözetimi
          altında kullanmalısınız.
        </Text>

        {/* Updates and Changes */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          9. Güncellemeler ve Değişiklikler
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          Hizmet Sağlayıcı, önceden bildirimde bulunmaksızın:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• Uygulamayı güncelleyebilir veya değiştirebilir</Text>
          <Text style={{ color: theme.textSenary }}>• Yeni özellikler ekleyebilir veya mevcut özellikleri kaldırabilir</Text>
          <Text style={{ color: theme.textSenary }}>• Bu kullanım şartlarını değiştirebilir (önemli değişiklikler bildirilir)</Text>
          <Text style={{ color: theme.textSenary }}>• Uygulamayı geçici veya kalıcı olarak durdurabilir</Text>
        </View>

        {/* Termination */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          10. Hesap Sonlandırma
        </Text>
        <Text style={{ lineHeight: 22, marginBottom: dimensions.sm, color: theme.textSenary }}>
          Hizmet Sağlayıcı, aşağıdaki durumlarda önceden bildirimde bulunmaksızın hesabınızı askıya alabilir veya sonlandırabilir:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• Bu kullanım şartlarını ihlal etmeniz</Text>
          <Text style={{ color: theme.textSenary }}>• Uygulamayı yasadışı amaçlarla kullanmanız</Text>
          <Text style={{ color: theme.textSenary }}>• Diğer kullanıcılara veya sisteme zarar vermeye çalışmanız</Text>
          <Text style={{ color: theme.textSenary }}>• Sahte bilgiler veya belge yüklemeniz</Text>
        </View>

        {/* Governing Law */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          11. Geçerli Hukuk
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          Bu kullanım şartları, Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklar Türkiye mahkemelerinde çözülecektir.
        </Text>

        {/* Intellectual Property */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          12. Fikri Mülkiyet Hakları
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          Uygulamanın tasarımı, logosu, içeriği ve kaynak kodu Hizmet Sağlayıcıya aittir ve telif hakkı yasalarıyla korunmaktadır. İzinsiz
          kullanım, kopyalama veya dağıtım yasaktır.
        </Text>

        {/* Entire Agreement */}
        <Text style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}>
          13. Tam Anlaşma
        </Text>
        <Text style={{ lineHeight: 22, color: theme.textSenary }}>
          Bu kullanım şartları, MoneyMapAi uygulamasının kullanımına ilişkin sizinle Hizmet Sağlayıcı arasındaki tam anlaşmayı oluşturur ve
          önceki tüm sözlü veya yazılı anlaşmaların yerini alır.
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
            <Text style={{ fontWeight: '700' }}>Yürürlük Tarihi:</Text> Bu kullanım şartları 31 Ekim 2025 tarihi itibarıyla yürürlüktedir.
            Uygulamayı kullanmaya devam ederek, bu şartları kabul etmiş sayılırsınız.
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
            İletişim
          </Text>
          <Text style={{ lineHeight: 22, marginBottom: dimensions.xs, color: theme.white }}>
            Bu kullanım şartları hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle iletişime geçin:
          </Text>
          <TouchableOpacity onPress={() => openMail('gargamel9288@gmail.com')} activeOpacity={0.7}>
            <Text style={{ color: theme.textPrimary, fontWeight: '700', textDecorationLine: 'underline' }}>
              E-posta: gargamel9288@gmail.com
            </Text>
          </TouchableOpacity>
          <Text style={{ marginTop: dimensions.sm, marginBottom: 0, color: theme.white }}>
            <Text style={{ fontWeight: '700' }}>Uygulama Adı:</Text> MoneyMapAi
          </Text>
          <Text style={{ color: theme.white }}>
            <Text style={{ fontWeight: '700' }}>Geliştirici:</Text> Ömer Aydın
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
          MoneyMapAi © 2025 - Tüm hakları saklıdır.
        </Text>
      </View>
    </ScrollView>
  );
}