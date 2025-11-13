import { supabase } from '../lib/supabase';
import { Transaction } from '../types/transactıonstype';

export const getUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    if (!user) {
      return null;
    }

    return user;
  } catch  {
    return null;
  }
};
interface CacheData<T> {
  data: T | null;
  timestamp: number | null;
  userId: string | null;
}

class TransactionCache<T = any> {
  private cache: CacheData<T> = {
    data: null,
    timestamp: null,
    userId: null,
  };
  private readonly expireTime = 5 * 60 * 1000; 

  isValid(currentUserId: string): boolean {
    const now = Date.now();
    return (
      this.cache.data !== null &&
      this.cache.timestamp !== null &&
      this.cache.userId === currentUserId &&
      now - this.cache.timestamp < this.expireTime
    );
  }
  set(data: T, userId: string): void {
    this.cache = {
      data,
      timestamp: Date.now(),
      userId,
    };
  }
  get(): T | null {
      return this.cache.data;
    }
  
  }
  

const transactionCache = new TransactionCache<Transaction[]>();


export const transactionsApi = {
  // günlük  transactionlarını getir
  getTransactionsByDay: async () => {
    const user = await getUser();
    if (!user?.id) throw new Error("User not found");
  
    // Bugünün tarihini YYYY-MM-DD formatında al (yerel saat dilimi)
    const today = new Date();
    const todayString = today.toLocaleDateString('en-CA'); // YYYY-MM-DD formatı
  
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        categories(*)
      `)
      .eq("user_id", user.id)
      .eq("date", todayString)
      .order("date", { ascending: true });
  
    if (error) {
      console.error("Supabase error:", error);
      throw new Error(error.message);
    }
  
    return data ?? [];
  },
  
  // haftalık transactionları getir
  getTransactionsBySevenDaysAgo: async () => {
    const user = await getUser();
    if (!user?.id) throw new Error('User not found');
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(*)
      `)
      .eq('user_id', user.id)
      .gte('date', sevenDaysAgo.toISOString())
      .lte('date', now.toISOString())
      .order('date', { ascending: true });
  
    if (error) throw new Error(error.message);
    const result = data || [];
    return result;
  },
  // son 2 haftanın transactionlarını getir
  getTransactionsByTwoWeeksAgo: async () => {
    const user = await getUser();
    if (!user?.id) throw new Error('User not found');
  
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(*)
      `)
      .eq('user_id', user.id)
      .gte('date', twoWeeksAgo.toISOString())
      .lte('date', now.toISOString())
      .order('date', { ascending: true });
  
    if (error) throw new Error(error.message);
    return data || [];
  },
  // aylık transactionları getir
  getTransactionsByMonth: async () => {
    const user = await getUser();
    if (!user?.id) throw new Error('User not found');
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(*)
      `)
      .eq('user_id', user.id)
      .gte('date', firstDay.toISOString())
      .lt('date', lastDay.toISOString())  
      .order('date', { ascending: true });
  
    if (error) throw new Error(error.message);
    const result = data || [];
    return result;
  },
  // son 6 ayın transactionlarını getir
  getTransactionsByLastSixMonths: async () => {
    const user = await getUser();
    if (!user?.id) throw new Error('User not found');
  
    const now = new Date();
    
    // 6 ay öncenin ilk günü (BAŞLANGIÇ)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    
    // Şu anki ayın son günü (BİTİŞ)
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfCurrentMonth.setHours(23, 59, 59, 999);

  
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(*)
      `)
      .eq('user_id', user.id)
      .gte('date', sixMonthsAgo.toISOString())      // ✅ Küçük tarih
      .lte('date', endOfCurrentMonth.toISOString()) // ✅ Büyük tarih
      .order('date', { ascending: true });
  
    if (error) throw new Error(error.message);
    return data || [];
  },
  // yıllık transactionları getir
  getTransactionsByYear: async () => {
    const user = await getUser();
    if (!user?.id) throw new Error('User not found');
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const nextYear = new Date(now.getFullYear() + 1, 0, 1); 
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(*)
      `)
      .eq('user_id', user?.id)
      .gte('date', firstDay.toISOString())
      .lte('date', nextYear.toISOString()) 
      .order('date', { ascending: true });

    if (error) throw new Error(error.message);
    const result = data || [];
    return result;
  },
  // son işlenen transactionları getir
  getTransactionsByLastprocess: async () => {
    const user = await getUser();
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(*)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);
    if (transactionsError) throw new Error(transactionsError.message);
    return {
      transactions: transactions || [],
    };
  },
  // tüm tabloları getir
  getallTables: async () => {
    const user = await getUser();
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(*),
        expense_items(*)
      `)
      .eq('user_id', user?.id)
      .order('date', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  // transaction sil
  deleteTransaction: async (transactionId: any) => {
    const user = await getUser();
    if (!user?.id) throw new Error('User not found');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);

    // Cache'i güncelle (item sil)
    if (transactionCache.isValid(user.id)) {
      const currentData = transactionCache.get() as any;
      const updatedData = currentData?.filter((t: any) => t.id !== transactionId) || [];
      transactionCache.set(updatedData, user.id);
    }
  },
  // Yeni transaction eklendiğinde cache'i güncelle
  addTransaction: async (transactionData: any) => {
    const user = await getUser();
    if (!user?.id) throw new Error('User not found');
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transactionData, user_id: user.id }])
      .select()
      .single();

    if (error) throw new Error('hata:' + error.message);

    if (!data) throw new Error('Transaction verisi alınamadı');

    // Cache'i güncelle (yeni item ekle)
    if (transactionCache.isValid(user.id)) {
      const currentData = transactionCache.get() as any;
      const updatedData = [...currentData, data] as any;
      // Tarihe göre sırala
      updatedData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      transactionCache.set(updatedData, user.id);
    }

    // expense_items için boş array döndür
    return {
      data: {
        ...data,
        expense_items: [],
      },
    };
  },
  deleteAllTransactions: async () => {
    const user = await getUser();
    if (!user?.id) throw new Error('User not found');

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);

    // Cache'i temizle
    transactionCache.set([], user.id);
  },
};
