import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import i18next from '../../../services/i18next';
import { showErrorToast, showSuccessToast } from '../../constants/toast';
import { Transaction, TransactionList } from '../../types/transactionTypes';
export const exportToPDF = async (
	data: TransactionList,
	setLoading: (loading: boolean) => void,
	tab: string
  ) => {
	setLoading(true);
	try {
	  const fs: any = FileSystem;
	  
	  // Calculate summary stats
	  const totalIncome = data.filter(t => t.type === 'gelir').reduce((sum, t) => sum + (t.total_amount || 0), 0);
	  const totalExpense = data.filter(t => t.type === 'gider').reduce((sum, t) => sum + (t.total_amount || 0), 0);
	  const balance = totalIncome - totalExpense;

	  const html = `
		  <!DOCTYPE html>
		  <html>
			<head>
			  <meta charset="utf-8" />
			  <style>
				body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; padding: 40px; line-height: 1.5; }
				.header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
				.app-name { font-size: 28px; font-weight: bold; color: #6366f1; }
				.report-title { font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
				
				.summary-grid { display: flex; gap: 20px; margin-bottom: 40px; }
				.summary-card { flex: 1; padding: 20px; border-radius: 12px; background: #f9fafb; border: 1px solid #e5e7eb; }
				.card-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
				.card-value { font-size: 20px; font-weight: bold; }
				.income { color: #10b981; }
				.expense { color: #ef4444; }
				.balance { color: #6366f1; }

				table { border-collapse: collapse; width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
				th { background: #6366f1; color: white; text-align: left; padding: 12px 15px; font-size: 12px; text-transform: uppercase; }
				td { border-bottom: 1px solid #f3f4f6; padding: 12px 15px; font-size: 11px; color: #374151; }
				tr:last-child td { border-bottom: none; }
				tr:nth-child(even) { background: #fcfcfc; }
				
				.badge { padding: 4px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; }
				.badge-income { background: #ecfdf5; color: #059669; }
				.badge-expense { background: #fef2f2; color: #dc2626; }
				
				.footer { margin-top: 50px; text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 20px; }
			  </style>
			</head>
			<body>
			  <div class="header">
				<div class="app-name">MoneyMapAi</div>
				<div class="report-title">${i18next.t('export.pdf.title')} - ${new Date().toLocaleDateString()}</div>
			  </div>

			  <div class="summary-grid">
				<div class="summary-card">
				  <div class="card-label">${i18next.t('finance.summary.totalIncome')}</div>
				  <div class="card-value income">+${totalIncome.toLocaleString()}</div>
				</div>
				<div class="summary-card">
				  <div class="card-label">${i18next.t('finance.summary.totalExpense')}</div>
				  <div class="card-value expense">-${totalExpense.toLocaleString()}</div>
				</div>
				<div class="summary-card">
				  <div class="card-label">${i18next.t('finance.summary.balance')}</div>
				  <div class="card-value balance">${balance.toLocaleString()}</div>
				</div>
			  </div>

			  <table>
				<thead>
				  <tr>
					<th>${i18next.t('export.headers.date')}</th>
					<th>${i18next.t('export.headers.category')}</th>
					<th>${i18next.t('export.headers.description')}</th>
					<th style="text-align: right;">${i18next.t('export.headers.amount')}</th>
				  </tr>
				</thead>
				<tbody>
				  ${data
			.map(
			  (u: Transaction) => `
					<tr>
					  <td>${u.date} <span style="color: #9ca3af; font-size: 9px;">${u.time}</span></td>
					  <td>
						<span class="badge ${u.type === 'gelir' ? 'badge-income' : 'badge-expense'}">
						  ${u.categories.name}
						</span>
					  </td>
					  <td>${u.description ? u.description : '-'}</td>
					  <td style="text-align: right; font-weight: bold; color: ${u.type === 'gelir' ? '#059669' : '#dc2626'}">
						${u.type === 'gelir' ? '+' : '-'}${u.total_amount.toLocaleString()}
					  </td>
					</tr>`
			)
			.join('')}
				</tbody>
			  </table>

			  <div class="footer">
				${i18next.t('export.pdf.footerGeneratedBy')} MoneyMapAi • ${new Date().toLocaleString()}
			  </div>
			</body>
		  </html>`;
  
	  const { uri } = await Print.printToFileAsync({ html });
	  const timestamp = new Date().toISOString().split("T")[0];
	  const baseDir: string = (fs.documentDirectory ?? fs.cacheDirectory ?? '') as string;
	  const fileName = `MoneyMap_Report_${timestamp}_${tab}.pdf`;
	  const target = baseDir + fileName;
	  await FileSystem.copyAsync({ from: uri, to: target });
  
	  if (await Sharing.isAvailableAsync()) {
		await Sharing.shareAsync(target, { UTI: "com.adobe.pdf", mimeType: "application/pdf" });
	  }
  
	  showSuccessToast(i18next.t('export.pdf.success'), i18next.t('export.pdf.successMessage'));
	} catch (error) {
	  console.error("PDF Export Error:", error);
	  showErrorToast(i18next.t('common.error'), i18next.t('export.pdf.error'));
	} finally {
	  setLoading(false);
	}
  };
  