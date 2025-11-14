import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import i18next from '../../../services/i18next';
import { showErrorToast, showSuccessToast } from '../../constanst/toast';
import { Transaction, TransactionList } from '../../types/transactıonstype';
export const exportToPDF = async (
	data: TransactionList,
	setLoading: (loading: boolean) => void,
	tab: string
  ) => {
	setLoading(true);
	try {
	  const fs: any = FileSystem;
	  const html = `
		  <html>
			<head>
			  <meta charset="utf-8" />
			  <style>
				body { font-family: -apple-system, Roboto, Arial, sans-serif; padding: 16px; }
				h1 { font-size: 20px; }
				table { border-collapse: collapse; width: 100%; }
				th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 12px; }
				th { background: #2563eb; color: white; text-align: left; }
				tr:nth-child(even) { background: #f9fafb; }
			  </style>
			</head>
			<body>
			  <h1>${i18next.t('export.pdf.title')}</h1>
			  <table>
				<thead>
				  <tr><th>${i18next.t('export.headers.category')}</th><th>${i18next.t('export.headers.type')}</th><th>${i18next.t('export.headers.amount')}</th><th>${i18next.t('export.headers.date')}</th><th>${i18next.t('export.headers.time')}</th><th>${i18next.t('export.headers.description')}</th></tr>
				</thead>
				<tbody>
				  ${data
			.map(
			  (u: Transaction) => `
					<tr>
					  <td>${u.categories.name}</td> 
					  <td>${u.type}</td>
					  <td>${u.total_amount}</td>
					  <td>${u.date}</td>
					  <td>${u.time}</td>
					  <td>${u.description ? u.description : ''}</td>
					</tr>`
			)
			.join('')}
				</tbody>
			  </table>
			</body>
		  </html>`;
  
	  const { uri } = await Print.printToFileAsync({ html });
	  const timestamp = new Date().toISOString().split("T")[0];
	  const baseDir: string = (fs.documentDirectory ?? fs.cacheDirectory ?? '') as string;
	  const target = baseDir + `gelirler_ve_giderler_${timestamp}_${tab}_kayıt.pdf`;
	  await FileSystem.copyAsync({ from: uri, to: target });
  
	  if (await Sharing.isAvailableAsync()) {
		await Sharing.shareAsync(target, { UTI: "com.adobe.pdf", mimeType: "application/pdf" });
	  }
  
	  showSuccessToast(i18next.t('export.pdf.success'), i18next.t('export.pdf.successMessage'));
	} catch  {
	  showErrorToast(i18next.t('common.error'), i18next.t('export.pdf.error'));
	} finally {
	  setLoading(false);
	}
  };
  