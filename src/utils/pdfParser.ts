import * as FileSystem from "expo-file-system/legacy";
import { extractText, isAvailable } from "expo-pdf-text-extract";
import { ParsedTransaction } from "./csvParser";

export const parsePDFReceipt = async (
  fileUri: string,
): Promise<ParsedTransaction | null> => {


  try {
    // 1. Modül kontrolü
    const available = isAvailable();


    if (!available) {
      console.error(
        "[PDF Debug] KRİTİK HATA: Native modül yüklü değil veya erişilemiyor!",
      );
      return null;
    }

    // 2. Dosya kontrolü
    const fileInfo = await FileSystem.getInfoAsync(fileUri);


    if (!fileInfo.exists) {
      console.error("[PDF Debug] HATA: Dosya bulunamadı!");
      return null;
    }

    // 3. Metin çıkarma

    const text = await extractText(fileUri);


    if (!text || text.trim().length === 0) {
      console.warn(
        "[PDF Debug] UYARI: PDF içinden metin okunamadı (Boş metin). PDF bir resim olabilir.",
      );
      return null;
    }

    // 4. Analiz - Çoklu Desen Kontrolü
    const cleanText = text.replace(/\s+/g, " ");

    // --- 1. BANKA TESPİTİ ---
    const textUpper = cleanText.toUpperCase();
    let detectedBank = "GENERIC";

    if (textUpper.includes("ZİRAAT")) detectedBank = "ZIRAAT";
    else if (
      textUpper.includes("ENPARA") ||
      textUpper.includes("FİNANSBANK") ||
      textUpper.includes("QNB")
    )
      detectedBank = "ENPARA";
    else if (textUpper.includes("GARANTİ") || textUpper.includes("BBVA"))
      detectedBank = "GARANTI";
    else if (textUpper.includes("İŞ BANKASI") || textUpper.includes("ISBANK"))
      detectedBank = "ISBANK";
    else if (
      textUpper.includes("YAPI KREDİ") ||
      textUpper.includes("YAPI VE KREDİ")
    )
      detectedBank = "YAPIKREDI";
    else if (textUpper.includes("AKBANK")) detectedBank = "AKBANK";
    else if (textUpper.includes("DENİZBANK")) detectedBank = "DENIZBANK";
    else if (textUpper.includes("HALKBANK")) detectedBank = "HALKBANK";
    else if (textUpper.includes("VAKIFBANK")) detectedBank = "VAKIFBANK";

    // --- 2. TİP BELİRLEME ---
    let type: "gelir" | "gider" = "gider";
    const incomeKeywords = [
      "YATIRILMIŞTIR",
      "HESABINIZA ALACAK",
      "GELEN FAST",
      "GELEN HAVALE",
      "ALACAK KAYDEDİLMİŞTİR",
    ];
    const expenseKeywords = [
      "HESABINIZA BORÇ",
      "GİDEN FAST",
      "GİDEN HAVALE",
      "HAVALE TUTARI",
      "EFT TUTARI",
      "KOMİSYON",
      "BORÇ KAYDEDİLMİŞTİR",
    ];

    if (incomeKeywords.some((k) => textUpper.includes(k))) type = "gelir";
    else if (expenseKeywords.some((k) => textUpper.includes(k))) type = "gider";
    else if (
      textUpper.includes("GÖNDEREN") &&
      textUpper.includes("ALICI") &&
      textUpper.indexOf("GÖNDEREN") < textUpper.indexOf("ALICI")
    ) {
      type = "gider";
    }

    // --- 3. TUTAR PARSE (HİBRİT MOTOR) ---
    let amount = 0;
    const parseAmount = (raw: string): number => {
      let clean = raw.replace(/[^\d,.-]/g, "").trim();
      // Eğer başında - varsa gider olduğunu teyit et
      if (clean.startsWith("-")) {
        type = "gider";
        clean = clean.substring(1);
      }

      const lastComma = clean.lastIndexOf(",");
      const lastDot = clean.lastIndexOf(".");

      if (lastComma > lastDot && lastComma !== -1) {
        return parseFloat(clean.replace(/\./g, "").replace(",", "."));
      } else if (lastDot > lastComma && lastDot !== -1) {
        return parseFloat(clean.replace(/,/g, ""));
      } else {
        return parseFloat(clean.replace(",", "."));
      }
    };

    const amountPatterns = [
      /(?:GİDEN FAST TUTARI|TOPLAM TAHSILAT TUTARI|İŞLEM TUTARI|HAVALE TUTARI|TUTAR|MİKTAR|AKTARILAN TUTAR|TOPLAM)\s*(?:\(TL\s*\))?[:\s-]*([-]?[\d.,\s]+)/i,
      /([-]?[\d.,\s]+)\s*(?:TL|TRY|₺)/i,
    ];

    for (const pattern of amountPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        const parsed = parseAmount(match[1]);
        if (!isNaN(parsed) && parsed > 0) {
          amount = parsed;
          break;
        }
      }
    }

    // --- 4. AÇIKLAMA VE ALICI ANALİZİ ---
    let recipient = "";
    let purpose = "";

    const purposePatterns = [
      /(?:AÇIKLAMA|ÖDEME AMACI|ACIKLAMA|MESAJ TÜRÜ)[:\s]+([^;:\n]{2,150})/i,
      /(?:VALÖR|TARİH).*?(?:TL|TRY|₺).*?\s+([^;:\n]{5,150})/i,
    ];

    for (const p of purposePatterns) {
      const m = cleanText.match(p);
      if (m && m[1] && m[1].length > 4 && !m[1].includes("TL")) {
        purpose = m[1].trim();
        break;
      }
    }

    purpose = purpose.replace(/\s+/g, " ").trim();

    // --- 5. TARİH ---
    let date = new Date().toISOString().split("T")[0];
    const dateMatch =
      cleanText.match(/(?:TARİH|VALÖR)[:\s]*(\d{2}[./-]\d{2}[./-]\d{4})/i) ||
      cleanText.match(/(\d{2}[./-]\d{2}[./-]\d{4})/);

    if (dateMatch) {
      const [d, m, y] = dateMatch[1].split(/[./-]/);
      date = `${y}-${m}-${d}`;
    }

    const result = {
      date,
      amount: Math.abs(amount),
      description:
        recipient || (type === "gider" ? "Para Transferi" : "Banka Girişi"),
      note: purpose,
      type,
    };


    return result;
  } catch (error: any) {
    console.error("[PDF Debug] Beklenmedik Hata:", error);
    return null;
  }
};
