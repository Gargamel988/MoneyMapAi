import { APP_CONFIG, CurrencyCode } from "../constants/config";

export const formatTotal = (total: number, currency?: string | { currency: string }) => {
	const safeCode = (() => {
	  let code = 'TRY';
  
	  // Eğer array ise ilk elemanın currency'sini al
	  if (Array.isArray(currency) && currency.length > 0) {
		code = currency[0]?.currency;
	  }
	  // Eğer obje ise currency property'sini al
	  else if (currency && typeof currency === 'object' && 'currency' in currency) {
		code = currency.currency;
	  }
	  // Eğer string ise direkt kullan
	  else if (typeof currency === 'string') {
		code = currency;
	  }
	  code = code.toString().trim().toUpperCase();
	  return /^[A-Z]{3}$/.test(code) ? code : 'TRY';
	})();
  
	const normalizedTotal = Number.isFinite(total) ? total : 0;
	const absTotal = Math.abs(normalizedTotal);
	const symbol = APP_CONFIG.currencies[safeCode as CurrencyCode]?.symbol || safeCode;
  
	// 1 milyon ve üstünü harfli gösterim
	const abbreviations = [
	  { limit: 1_000_000_000, suffix: 'B' }, // Billion
	  { limit: 1_000_000, suffix: 'M' },     // Million
	];
  
	const match = abbreviations.find(({ limit }) => absTotal >= limit);
  
	if (match) {
	  const scaled = normalizedTotal / match.limit;
	  const shortFormatted = new Intl.NumberFormat('tr-TR', {
		minimumFractionDigits: scaled < 10 ? 2 : 1,
		maximumFractionDigits: scaled < 10 ? 2 : 1,
	  }).format(scaled);
  
	  return `${shortFormatted}${match.suffix} ${symbol}`;
	}
  
	// Formatlanmış sayıyı kuruşlarla birlikte al
	const formatted = new Intl.NumberFormat('tr-TR', {
	  minimumFractionDigits: 2,  // En az 2 ondalık basamak
	  maximumFractionDigits: 2,  // En fazla 2 ondalık basamak
	}).format(normalizedTotal);
  
	// Para birimi koduna göre sembol pozisyonu
	return `${formatted} ${symbol}`;
};