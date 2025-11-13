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
  
	// Para birimi sembolleri mapping
	const currencySymbols: Record<string, string> = {
	  'TRY': '₺',
	  'USD': '$',
	  'EUR': '€',
	  'GBP': '£',
	  'JPY': '¥',
	  'CNY': '¥',
	};
  
	// Formatlanmış sayıyı kuruşlarla birlikte al
	const formatted = new Intl.NumberFormat('tr-TR', {
	  minimumFractionDigits: 2,  // En az 2 ondalık basamak
	  maximumFractionDigits: 2,  // En fazla 2 ondalık basamak
	}).format(Number.isFinite(total) ? total : 0);
  
	// Sembol varsa kullan, yoksa code'u kullan
	const symbol = currencySymbols[safeCode] || safeCode;
  
	// Para birimi koduna göre sembol pozisyonu
	return `${formatted} ${symbol}`;
};