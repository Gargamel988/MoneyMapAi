import i18next from "i18next";

export const formatDate = (date: Date | string | undefined): string => {
	try {
	  // date undefined veya null ise bugünün tarihini kullan
	  const dateObj = date ? new Date(date) : new Date();
	  
	  // Geçerli bir tarih mi kontrol et
	  if (isNaN(dateObj.getTime())) {
		console.warn('Invalid date provided to formatDate:', date);
		return new Date().toDateString();
	  }
	  
	  const locale = i18next.language === 'tr' ? 'tr-TR' : 'en-US';

	  return new Intl.DateTimeFormat(locale, {
		year: 'numeric', 
		month: 'long', 
		day: '2-digit',
	  }).format(dateObj); 
	} catch (error) {
	  // Hata durumunda güvenli fallback
	  console.warn('Date formatting error:', error);
	  return date && typeof date === 'object' && 'toDateString' in date
		? (date as Date).toDateString() 
		: new Date().toDateString();
	}
  };
  export const formatTime = (time: string) => {
    return time.split(":")[0] + ":" + time.split(":")[1];
  };
  export const formatWeekRange = (start: string, end: string): string => {
	const options: Intl.DateTimeFormatOptions = {
	  day: "numeric",
	  month: "long",
	};
  
	const startDate = new Date(start);
	const endDate = new Date(end);
	
	const locale = i18next.language === 'tr' ? 'tr-TR' : 'en-US';
  
	const startFormatted = startDate.toLocaleDateString(locale, options);
	const endFormatted = endDate.toLocaleDateString(locale, options);
  
	return `${startFormatted} - ${endFormatted}`;
  }