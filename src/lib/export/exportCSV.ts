import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import i18next from '../../../services/i18next';
import { showErrorToast, showSuccessToast } from '../../constanst/toast';
import { Transaction, TransactionList } from '../../types/transactıonstype';


export const exportToCSV = async (
	data: TransactionList,
	setLoading: (loading: boolean) => void,
	tab: string
  ) => {
	setLoading(true);
  
	try {
	  const fs: any = FileSystem;
	  // CSV formatında veri oluştur (UTF-8 BOM ile Türkçe karakter desteği)
	  const BOM = '\uFEFF'; // UTF-8 BOM
	  const headers = `${i18next.t('export.headers.category')},${i18next.t('export.headers.type')},${i18next.t('export.headers.amount')},${i18next.t('export.headers.date')},${i18next.t('export.headers.time')},${i18next.t('export.headers.description')}\n`;
	  const csvContent = data
		.map(
		  (user: Transaction) =>
			`${user.categories.name},"${user.type}","${user.total_amount}","${user.date}","${user.time}","${user.description ? user.description : ''}"`
		)
		.join('\n');
  
	  const fullCSV = BOM + headers + csvContent;
  
	  const timestamp = new Date().toISOString().split('T')[0];
	  const fileName = `gelirler_ve_giderler_${timestamp}_${tab}_kayıt.csv`;
	  const baseDir: string = (fs.documentDirectory ?? fs.cacheDirectory ?? '') as string;
	  const path = baseDir + fileName;
	  await FileSystem.writeAsStringAsync(path, fullCSV, { encoding: 'utf8' as any });
  
	  if (await Sharing.isAvailableAsync()) {
		await Sharing.shareAsync(path, {
		  UTI: 'public.comma-separated-values-text',
		  mimeType: 'text/csv',
		});
	  }
  
	  showSuccessToast(i18next.t('export.csv.success'), i18next.t('export.csv.successMessage', { fileName }));
	} catch  {
	  showErrorToast(i18next.t('common.error'), i18next.t('export.csv.error'));
	} finally {
	  setLoading(false);
	}
  };