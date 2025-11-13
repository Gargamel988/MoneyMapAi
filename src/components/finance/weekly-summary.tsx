import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useTheme } from '../../contexts/theme';
import { useResponsive } from '../../hooks/useRespons';
import { Transaction, TransactionList } from '../../types/transactıonstype';
import { formatWeekRange } from '../../utils/date';
import { WeeklyCard } from '../ui/weekly-card';
import InfoCard from '../ui/ınfo-card';


interface WeeklySummaryProps {
  data: TransactionList;
  isLoading: boolean;
  error: Error;
  currency: string;
}

// Bu haftanın başlangıcı (Pazartesi)
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

// Bu haftanın sonu (Pazar)
function getWeekEnd(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

// Geçen haftanın başlangıcı (Pazartesi)
function getLastWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) - 7;
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

// Geçen haftanın sonu (Pazar)
function getLastWeekEnd(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) - 1;
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

// Yüzdelik değişim hesaplama fonksiyonu
function calculatePercentageChange(current: number, previous: number): { percentage: number; isIncrease: boolean } {
  if (previous === 0) {
    return { percentage: current > 0 ? 100 : 0, isIncrease: current > 0 };
  }
  const change = ((current - previous) / previous) * 100;
  return { percentage: Math.abs(change), isIncrease: change > 0 };
}

export default function WeeklySummary({ data, isLoading, error, currency }: WeeklySummaryProps) {
  const { theme } = useTheme();
  const { hp, wp } = useResponsive();
  const { t } = useTranslation();
  const sevenDaysAgoData = Array.isArray(data) ? data : [];

  // Bu haftanın verileri
  const thisWeekStart = getWeekStart();
  const thisWeekEnd = getWeekEnd();
  
  const totalincome = sevenDaysAgoData
    ?.filter((item: Transaction) => 
      item && 
      item.type === 'gelir' && 
      item.date && 
      item.date >= thisWeekStart && 
      item.date <= thisWeekEnd
    )
    ?.reduce((acc: number, item: Transaction) => acc + (item?.total_amount || 0), 0) || 0;

  const totalexpense = sevenDaysAgoData
    ?.filter((item: Transaction) => 
      item && 
      item.type === 'gider' && 
      item.date && 
      item.date >= thisWeekStart && 
      item.date <= thisWeekEnd
    )
    ?.reduce((acc: number, item: Transaction) => acc + (item?.total_amount || 0), 0) || 0;

  const totalbalance = totalincome - totalexpense;

  // Geçen haftanın verileri
  const lastWeekStart = getLastWeekStart();
  const lastWeekEnd = getLastWeekEnd();
  
  const lastweekdata = sevenDaysAgoData.filter((item: Transaction) => 
    item.date >= lastWeekStart && item.date <= lastWeekEnd
  );
  
  const lastweekdataincome = lastweekdata
    ?.filter((item: Transaction) => item.type === 'gelir')
    ?.reduce((acc: number, item: Transaction) => acc + (item.total_amount || 0), 0) || 0;
    
  const lastweekdataexpense = lastweekdata
    ?.filter((item: Transaction) => item.type === 'gider')
    ?.reduce((acc: number, item: Transaction) => acc + (item.total_amount || 0), 0) || 0;
  
  const lastweekbalance = lastweekdataincome - lastweekdataexpense;

  // Yüzdelik değişimler
  const incomeChange = calculatePercentageChange(totalincome, lastweekdataincome);
  const expenseChange = calculatePercentageChange(totalexpense, lastweekdataexpense);
  const balanceChange = calculatePercentageChange(totalbalance, lastweekbalance);


  return (
    <View style={{ flex: 1, marginHorizontal: wp(4), marginTop: hp(2) }}>
    {/* Haftalık Özet Başlığı */}
    <View
      style={{
        width: wp(90),
        alignItems: "center",
        gap: hp(0.3),
        marginBottom: hp(2),
      }}
    >
      <Text
        style={{
          fontSize: hp(2.4),
          fontWeight: "700",
          color: theme.text,
          letterSpacing: 0.3,
        }}
      >
        {t('weeklySummary.title')}
      </Text>
      <Text
        style={{
          fontSize: hp(1.6),
          fontWeight: "500",
          color: theme.text,
        }}
      >
        {formatWeekRange(thisWeekStart, thisWeekEnd)}
      </Text>
      <Text
        style={{
          fontSize: hp(1.6),
          fontWeight: "400",
          color: theme.textSecondary,
          lineHeight: hp(2.2),
          marginTop: hp(0.5),
          textAlign: "center",
        }}
      >
        {t('weeklySummary.description')}
      </Text>
    </View>

    {/* Kartlar */}
    <View
      style={{
        alignItems: "center",
        gap: hp(1.8),
      }}
    >
      <WeeklyCard
        id="income"
        name={t('weeklySummary.cards.income')}
        value={totalincome}
        currency={currency}
        change={incomeChange}
        isLoading={isLoading}
        error={error}
      />
      <WeeklyCard
        id="expense"
        name={t('weeklySummary.cards.expense')}
        value={totalexpense}
        currency={currency}
        change={expenseChange}
        isLoading={isLoading}
        error={error}
      />
      <WeeklyCard
        id="balance"
        name={t('weeklySummary.cards.balance')}
        value={totalbalance}
        currency={currency}
        change={balanceChange}
        isLoading={isLoading}
        error={error}
      />
    </View>

    {/* Alt Bilgi Notu */}
  <InfoCard>
    {t('weeklySummary.tip')}
  </InfoCard>
  </View>
  );
}