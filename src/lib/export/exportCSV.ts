import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import i18next from '../../../services/i18next';
import { showErrorToast, showSuccessToast } from '../../constants/toast';
import { Transaction, TransactionList } from '../../types/transactionTypes';


export const exportToCSV = async (
	data: TransactionList,
	setLoading: (loading: boolean) => void,
	tab: string,
	t: any
  ) => {
	setLoading(true);
  
	try {
	  const fs: any = FileSystem;
	  // CSV formatında veri oluştur (UTF-8 BOM ile Türkçe karakter desteği)
	  const BOM = '\uFEFF'; // UTF-8 BOM
	  const headers = `${t('export.headers.category')},${t('export.headers.type')},${t('export.headers.amount')},${t('export.headers.date')},${t('export.headers.time')},${t('export.headers.description')}\n`;
	  const csvContent = data
		.map(
		  (user: Transaction) =>
			`"${t(user.categories.name)}","${t(user.type === 'gelir' ? 'lastProcess.badge.income' : 'lastProcess.badge.expense')}","${user.total_amount}","${user.date}","${user.time}","${user.description ? user.description : ''}"`
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
  
	  showSuccessToast(t('export.csv.success'), t('export.csv.successMessage', { fileName }));
	} catch  {
	  showErrorToast(t('common.error'), t('export.csv.error'));
	} finally {
	  setLoading(false);
	}
  };