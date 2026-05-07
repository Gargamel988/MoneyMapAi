import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { showErrorToast, showSuccessToast } from '../../constants/toast';
import { useTheme } from '../../contexts/theme';
import { useResponsive } from '../../hooks/useResponsive';
import { parseCSV } from '../../utils/csvParser';
import { parsePDFReceipt } from '../../utils/pdfParser';

interface ImportCSVSectionProps {
  onImport?: (data: any) => void;
}

export const ImportCSVSection: React.FC<ImportCSVSectionProps> = ({ onImport }) => {
  const { theme } = useTheme();
  const { dimensions } = useResponsive();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      // console.log(result.assets)

      if (result.canceled) return;

      setLoading(true);
      const asset = result.assets[0];
      const isPdf = asset.name?.toLowerCase().endsWith('.pdf') || asset.mimeType === 'application/pdf';

      let parsedTransactions: any[] = [];

      if (isPdf) {
        const pdfResult = await parsePDFReceipt(asset.uri);
        if (pdfResult) parsedTransactions = [pdfResult];
      } else {
        const fileContent = await FileSystem.readAsStringAsync(asset.uri);
        parsedTransactions = parseCSV(fileContent);
      }

      if (parsedTransactions.length === 0) {
        Alert.alert(t('common.error'), 'Dosyada geçerli işlem bulunamadı veya format desteklenmiyor.');
        setLoading(false);
        return;
      }

      // If onImport is provided, use it to fill the form
      if (onImport) {
        onImport(parsedTransactions[0]);
        showSuccessToast('Başarılı', 'İşlem detayları forma aktarıldı.');
      } else {
        showErrorToast('Hata', 'Aktarım yapılamadı.');
      }

    } catch (error) {
      console.error('Pick error:', error);
      showErrorToast('Hata', 'Dosya okunurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginTop: dimensions.lg }}>
      <Text style={{ color: theme.text, fontSize: dimensions.fontMD, fontWeight: '700', marginBottom: dimensions.sm }}>
        Banka Ekstresi İçe Aktar
      </Text>
      <TouchableOpacity
        onPress={handlePickDocument}
        disabled={loading}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          backgroundColor: theme.cardGlass,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.cardBorder,
          borderStyle: 'dashed'
        }}
      >
        {loading ? (
          <ActivityIndicator color={theme.primary} />
        ) : (
          <>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Feather name="file-text" size={24} color={theme.primary} />
              <MaterialCommunityIcons name="file-pdf-box" size={26} color={theme.error} />
            </View>
            <Text style={{ color: theme.text, fontWeight: '600' }}>CSV veya PDF Dekont Seç</Text>
          </>
        )}
      </TouchableOpacity>
      <Text style={{ color: theme.textTertiary, fontSize: 10, marginTop: 8, textAlign: 'center' }}>
        Desteklenenler: Garanti, İş Bankası CSV ve Tüm Banka PDF Dekontları
      </Text>
    </View>
  );
};
