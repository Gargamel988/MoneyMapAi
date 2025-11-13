import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../src/contexts/theme';
import { useResponsive } from '../../../src/hooks/useRespons';

export default function PrivacyPolicy() {
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
          Gizlilik Politikası
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

        <Text style={{ color: theme.textSenary, lineHeight: 22, marginBottom: dimensions.md }}>
          Bu gizlilik politikası, ömer (bundan böyle Hizmet Sağlayıcı olarak anılacaktır) tarafından ücretsiz bir hizmet olarak oluşturulan
          mobil cihazlar için <Text style={{ fontWeight: '700' }}>MoneyMapAi</Text> uygulaması (bundan böyle Uygulama olarak anılacaktır)
          için geçerlidir. Bu hizmet OLDUĞU GİBİ kullanılmak üzere tasarlanmıştır.
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
            ⚠️ Önemli: Kamera İzni ve Kullanımı
          </Text>

          <Text style={{ color: theme.textSenary, marginBottom: dimensions.sm }}>
            <Text style={{ fontWeight: '700' }}>Uygulama kamera izni (android.permission.CAMERA) kullanır.</Text> Bu izin aşağıdaki amaçlarla
            kullanılır:
          </Text>

          <View style={{ gap: dimensions.xs, marginBottom: dimensions.md }}>
            <Text style={{ color: theme.textSenary }}>
              • <Text style={{ fontWeight: '700' }}>Fatura ve Makbuz Fotoğrafı Çekmek:</Text> Harcamalarınızı kaydetmek için fatura ve
              makbuz fotoğrafları çekebilirsiniz
            </Text>
            <Text style={{ color: theme.textSenary }}>
              • <Text style={{ fontWeight: '700' }}>Yapay Zeka ile Analiz:</Text> Çekilen fotoğraflar, harcama bilgilerini otomatik olarak
              çıkarmak için AI teknolojisi ile işlenir
            </Text>
          </View>

          <Text style={{ color: theme.textSenary, marginBottom: dimensions.xs, fontWeight: '700' }}>
            Gizliliğiniz Bizim İçin Önemli:
          </Text>
          <View style={{ gap: dimensions.xs }}>
            <Text style={{ color: theme.textSenary }}>✓ Çekilen fotoğraflar yalnızca AI analizi için kullanılır</Text>
            <Text style={{ color: theme.textSenary }}>
              ✓ Fotoğraflar cihazınızda yerel olarak işlenir veya güvenli şekilde şifrelenmiş sunucularımıza gönderilir
            </Text>
            <Text style={{ color: theme.textSenary }}>✓ İşlenen fotoğraflar, analiz tamamlandıktan sonra silinebilir</Text>
            <Text style={{ color: theme.textSenary }}>✓ Kamera izninizi istediğiniz zaman cihaz ayarlarından iptal edebilirsiniz</Text>
            <Text style={{ color: theme.textSenary }}>✓ Hiçbir fotoğraf üçüncü taraflarla paylaşılmaz</Text>
          </View>
        </View>

        {/* Information Collection */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          Bilgi Toplama ve Kullanımı
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22, marginBottom: dimensions.sm }}>
          Uygulamayı indirip kullandığınızda bilgi toplar. Bu bilgiler aşağıdaki gibi bilgileri içerebilir:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• Cihazınızın İnternet Protokolü adresi (örneğin IP adresi)</Text>
          <Text style={{ color: theme.textSenary }}>
            • Ziyaret ettiğiniz Uygulama sayfaları, ziyaretinizin saati ve tarihi, bu sayfalarda harcanan süre
          </Text>
          <Text style={{ color: theme.textSenary }}>• Uygulamada harcanan süre</Text>
          <Text style={{ color: theme.textSenary }}>• Mobil cihazınızda kullandığınız işletim sistemi</Text>
          <Text style={{ color: theme.textSenary }}>• Fatura ve makbuz fotoğrafları (yalnızca sizin onayınızla)</Text>
          <Text style={{ color: theme.textSenary }}>
            • AI analizi sonucu çıkarılan harcama bilgileri (tutar, tarih, kategori, vb.)
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
            <Text style={{ fontWeight: '700' }}>Not:</Text> Uygulama mobil cihazınızın konumu hakkında kesin bilgi toplamaz.
          </Text>
        </View>

        {/* AI Usage */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          Yapay Zeka (AI) Kullanımı
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22, marginBottom: dimensions.sm }}>
          Uygulama, fatura ve makbuz fotoğraflarınızı analiz etmek için yapay zeka teknolojisi kullanır. Bu süreçte:
        </Text>
        <View style={{ gap: dimensions.xs }}>
          <Text style={{ color: theme.textSenary }}>• Fotoğraflarınız otomatik olarak işlenir ve metin tanıma (OCR) yapılır</Text>
          <Text style={{ color: theme.textSenary }}>• Tutar, tarih, satıcı adı ve kategori bilgileri çıkarılır</Text>
          <Text style={{ color: theme.textSenary }}>
            • İşlem tamamlandıktan sonra orijinal fotoğraf silinebilir veya şifrelenmiş olarak saklanabilir
          </Text>
          <Text style={{ color: theme.textSenary }}>
            • AI analizi için kullanılan üçüncü taraf servisler, kendi gizlilik politikalarına tabidir
          </Text>
        </View>

        {/* Third Party Access */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          Üçüncü Taraf Erişimi
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22, marginBottom: dimensions.sm }}>
          Uygulamanın, verilerin işlenmesine ilişkin kendi Gizlilik Politikaları olan üçüncü taraf hizmetlerinden yararlandığını
          lütfen unutmayın:
        </Text>
        <TouchableOpacity onPress={() => openUrl('https://policies.google.com/privacy')} activeOpacity={0.7}>
          <Text style={{ color: theme.link, textDecorationLine: 'underline' }}>Google Play Hizmetleri</Text>
        </TouchableOpacity>

        {/* Opt-out Rights */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          Çıkış Hakları
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          Uygulamayı kaldırarak tüm bilgi toplama işlemlerini kolayca durdurabilirsiniz. Mobil cihazınızda veya mobil uygulama
          pazaryeri veya ağı aracılığıyla mevcut olabilecek standart kaldırma işlemlerini kullanabilirsiniz.
        </Text>

        {/* Data Retention */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          Veri Saklama Politikası
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          Hizmet Sağlayıcı, Kullanıcı Tarafından Sağlanan verileri, Uygulamayı kullandığınız süre boyunca ve sonrasında makul bir süre
          boyunca saklayacaktır. Uygulama aracılığıyla sağladığınız Kullanıcı Tarafından Sağlanan Verilerin (fatura fotoğrafları dahil)
          silinmesini isterseniz, lütfen <Text style={{ fontWeight: '700' }}>gargamel9288@gmail.com</Text> adresinden onlarla iletişime
          geçin; makul bir süre içinde yanıt vereceklerdir.
        </Text>

        {/* Children */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          Çocuklar
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          Uygulama 13 yaşın altındaki kişilere yönelik değildir. Hizmet Sağlayıcı, 13 yaşın altındaki çocuklardan bilerek kişisel olarak
          tanımlanabilir bilgi toplamaz. Hizmet Sağlayıcı, 13 yaşın altındaki bir çocuğun kişisel bilgi verdiğini tespit ederse, bu bilgileri
          derhal sunucularından siler.
        </Text>

        {/* Security */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          Güvenlik
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          Hizmet Sağlayıcı, bilgilerinizin gizliliğini korumayı önemsemektedir. Hizmet Sağlayıcı, işlediği ve sakladığı bilgileri (fatura
          fotoğrafları dahil) korumak için fiziksel, elektronik ve prosedürel güvenlik önlemleri sağlar. Tüm hassas veriler şifrelenerek
          saklanır ve iletilir.
        </Text>

        {/* Changes */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          Değişiklikler
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          Bu Gizlilik Politikası, herhangi bir nedenle zaman zaman güncellenebilir. Hizmet Sağlayıcı, bu sayfayı yeni Gizlilik Politikası ile
          güncelleyerek Gizlilik Politikası kapsamındaki değişiklikleri size bildirecektir.
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          <Text style={{ fontWeight: '700' }}>Bu gizlilik politikası 31 Ekim 2025 tarihi itibarıyla geçerlidir.</Text>
        </Text>

        {/* Consent */}
        <Text
          style={{ color: theme.textQuaternary, marginTop: dimensions.lg, fontSize: dimensions.fontXL, fontWeight: '700' }}
        >
          Onayınız
        </Text>
        <Text style={{ color: theme.textSenary, lineHeight: 22 }}>
          Uygulamayı kullanarak, bilgilerinizin (kamera izni ve çekilen fotoğraflar dahil) bu Gizlilik Politikasında belirtildiği ve
          tarafımızca değiştirildiği şekilde işlenmesine onay vermiş olursunuz.
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
            Bize Ulaşın
          </Text>
          <Text style={{ color: theme.white, lineHeight: 22, marginBottom: dimensions.xs }}>
            Uygulamayı kullanırken gizlilikle ilgili herhangi bir sorunuz varsa, kamera izni veya fotoğraf işleme hakkında sorularınız
            varsa, lütfen e-posta yoluyla Hizmet Sağlayıcı ile iletişime geçin:
          </Text>
          <TouchableOpacity onPress={() => openMail('gargamel9288@gmail.com')} activeOpacity={0.7}>
            <Text style={{ color: theme.textPrimary, fontWeight: '700', textDecorationLine: 'underline' }}>
              E-posta: gargamel9288@gmail.com
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
          Bu gizlilik politikası sayfası, Uygulama Gizlilik Politikası Oluşturucu kullanılarak oluşturulmuş ve MoneyMapAi uygulamasının
          ihtiyaçlarına göre özelleştirilmiştir.
        </Text>
      </View>
    </ScrollView>
  );
}