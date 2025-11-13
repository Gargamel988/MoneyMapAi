import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
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
	  const headers = 'Kategori,Tip,Tutar,Tarih,Saat,Açıklama\n';
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
  
	  showSuccessToast('CSV Başarılı!', `CSV dosyası başarıyla oluşturuldu!\nDosya: ${fileName}`);
	} catch  {
	  showErrorToast('Hata', 'CSV dosyası oluşturulurken bir hata oluştu.');
	} finally {
	  setLoading(false);
	}
  };