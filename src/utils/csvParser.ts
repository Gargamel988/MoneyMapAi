import { TransactionType } from '../types/transactionTypes';

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
}

export const parseCSV = (csvText: string, bank: 'garanti' | 'isbank' | 'generic' = 'generic'): ParsedTransaction[] => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].toLowerCase().split(/[;,]/);
  const dataLines = lines.slice(1);

  return dataLines.map(line => {
    const values = line.split(/[;,]/);
    
    let date = '';
    let description = '';
    let amount = 0;
    let type: TransactionType = 'gider';

    if (bank === 'garanti') {
      // Garanti specific logic (example: Date at 0, Description at 1, Amount at 2)
      date = values[0];
      description = values[1];
      amount = parseFloat(values[2].replace(',', '.'));
    } else if (bank === 'isbank') {
      // İş Bankası specific logic
      date = values[0];
      description = values[1];
      amount = parseFloat(values[3].replace(',', '.')); // İş Bankası usually has more columns
    } else {
      // Generic logic: try to find keywords
      const dateIdx = headers.findIndex(h => h.includes('tarih') || h.includes('date'));
      const descIdx = headers.findIndex(h => h.includes('açıklama') || h.includes('desc') || h.includes('tanım'));
      const amountIdx = headers.findIndex(h => h.includes('tutar') || h.includes('amount') || h.includes('miktar'));

      date = values[dateIdx] || new Date().toISOString();
      description = values[descIdx] || 'No description';
      amount = parseFloat(values[amountIdx]?.replace(',', '.') || '0');
    }

    type = amount > 0 ? 'gelir' : 'gider';
    
    return {
      date: formatParsedDate(date),
      description: description.trim(),
      amount: Math.abs(amount),
      type
    };
  });
};

const formatParsedDate = (dateStr: string): string => {
  // Try to parse common formats like DD.MM.YYYY
  const parts = dateStr.split(/[./-]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) { // YYYY is at the end
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return dateStr; // Return as is if not recognized
};
