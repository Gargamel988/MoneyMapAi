import { User } from '@supabase/supabase-js';

export const createDefaultCategories = (user: User, type: 'gelir' | 'gider') => {
  const incomeCategories = [
    { name: 'Maaş', icon: 'dollar-sign', color: '#10B981' },
    { name: 'Freelance', icon: 'briefcase', color: '#3B82F6' },
    { name: 'Yatırım', icon: 'trending-up', color: '#8B5CF6' },
    { name: 'İkramiye', icon: 'gift', color: '#F59E0B' },
    { name: 'Satış', icon: 'shopping-bag', color: '#06B6D4' },
    { name: 'Kira Geliri', icon: 'home', color: '#EC4899' },
    { name: 'Diğer', icon: 'more-horizontal', color: '#6B7280' },
  ];

  const expenseCategories = [
    { name: 'Market', icon: 'shopping-cart', color: '#EF4444' },
    { name: 'Ulaşım', icon: 'truck', color: '#F59E0B' },
    { name: 'Faturalar', icon: 'file-text', color: '#3B82F6' },
    { name: 'Kira', icon: 'home', color: '#8B5CF6' },
    { name: 'Eğlence', icon: 'film', color: '#EC4899' },
    { name: 'Sağlık', icon: 'heart', color: '#10B981' },
    { name: 'Giyim', icon: 'shopping-bag', color: '#06B6D4' },
    { name: 'Yemek', icon: 'coffee', color: '#F97316' },
    { name: 'Eğitim', icon: 'book', color: '#6366F1' },
    { name: 'Diğer', icon: 'more-horizontal', color: '#6B7280' },
  ];

  const selected = type === 'gelir' ? incomeCategories : expenseCategories;

  return selected.map((cat) => ({
    ...cat,
    type,
    user_id: user.id,
  }));
};
