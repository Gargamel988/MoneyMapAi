import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx-js-style";
import { showErrorToast, showSuccessToast } from "../../constants/toast";
import { Transaction, TransactionList } from "../../types/transactionTypes";
import { formatTotal } from "../../utils/total";

export const exportToExcel = async (
  data: TransactionList,
  setLoading: (loading: boolean) => void,
  tab: string,
  t: any,
) => {
  setLoading(true);

  try {
    const fs: any = FileSystem;
    // Excel başlıkları
    const headers = [
      t("export.headers.category"),
      t("export.headers.type"),
      t("export.headers.amount"),
      t("export.headers.date"),
      t("export.headers.time"),
      t("export.headers.description"),
    ];

    // Veriyi Excel formatına dönüştür
    const wsData = [
      headers,
      ...data.map((user: Transaction) => [
        t(user.categories.name),
        t(
          user.type === "gelir"
            ? "lastProcess.badge.income"
            : "lastProcess.badge.expense",
        ),
        formatTotal(user.total_amount),
        user.date,
        user.time,
        user.description ? user.description : "",
      ]),
    ];

    // Worksheet oluştur
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Sütun genişliklerini ayarla
    ws["!cols"] = [
      { wch: 30 }, // ID
      { wch: 20 }, // Tip
      { wch: 20 }, // Tutar
      { wch: 25 }, // Tarih
      { wch: 15 }, // Saat
      { wch: 15 }, // Kategori
      { wch: 15 }, // Açıklama
    ];

    // Başlık satırını formatla (kalın yazı)
    const headerRange = XLSX.utils.decode_range(ws["!ref"] as string);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EEEEEE" } },
      };
    }

    // Workbook oluştur
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t("export.sheetName"));

    // Base64 olarak yaz ve kaydet
    const base64 = XLSX.write(wb, { bookType: "xlsx", type: "base64" });

    const timestamp = new Date().toISOString().split("T")[0];
    const fileName = `gelirler_ve_giderler_${timestamp}_${tab}_kayıt.xlsx`;
    const baseDir: string = (fs.documentDirectory ??
      fs.cacheDirectory ??
      "") as string;
    const uri = baseDir + fileName;
    await FileSystem.writeAsStringAsync(uri, base64, {
      encoding: "base64" as any,
    });

    // Paylaşım menüsü
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: "com.microsoft.excel.xlsx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    }

    showSuccessToast(
      t("export.excel.success"),
      t("export.excel.successMessage", { fileName }),
    );
  } catch {
    showErrorToast(t("common.error"), t("export.excel.error"));
  } finally {
    setLoading(false);
  }
};
