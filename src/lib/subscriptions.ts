import { supabase } from './supabase';

export interface SavedSubscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category: string;
  frequency: 'monthly' | 'yearly';
  next_date: string;
  last_date: string;
  is_active: boolean;
  created_at: string;
}

export const subscriptionsApi = {
  getAll: async (): Promise<SavedSubscription[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Kullanıcı bulunamadı');

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  save: async (sub: Omit<SavedSubscription, 'id' | 'user_id' | 'created_at'>): Promise<SavedSubscription> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Kullanıcı bulunamadı');

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{ ...sub, user_id: user.id }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  toggle: async (id: string, is_active: boolean): Promise<void> => {
    const { error } = await supabase
      .from('subscriptions')
      .update({ is_active })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  isSaved: async (name: string, amount: number): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', name)
      .eq('amount', amount)
      .limit(1);

    return (data?.length ?? 0) > 0;
  },
};
