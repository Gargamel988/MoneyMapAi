import { User } from '@supabase/supabase-js';

export const createDefaultCategories = (user: User, type: 'gelir' | 'gider') => {
  const incomeCategories = [
    { name: 'Salary', icon: 'dollar-sign', color: '#10B981' },
    { name: 'Freelance', icon: 'briefcase', color: '#3B82F6' },
    { name: 'Investment', icon: 'trending-up', color: '#8B5CF6' },
    { name: 'Bonus', icon: 'gift', color: '#F59E0B' },
    { name: 'Sales', icon: 'shopping-bag', color: '#06B6D4' },
    { name: 'Rent Income', icon: 'home', color: '#EC4899' },
    { name: 'Other', icon: 'more-horizontal', color: '#6B7280' },
  ];

  const expenseCategories = [
    { name: 'Grocery', icon: 'shopping-cart', color: '#EF4444' },
    { name: 'Transportation', icon: 'truck', color: '#F59E0B' },
    { name: 'Bills', icon: 'file-text', color: '#3B82F6' },
    { name: 'Rent', icon: 'home', color: '#8B5CF6' },
    { name: 'Entertainment', icon: 'film', color: '#EC4899' },
    { name: 'Health', icon: 'heart', color: '#10B981' },
    { name: 'Clothing', icon: 'shopping-bag', color: '#06B6D4' },
    { name: 'Food', icon: 'coffee', color: '#F97316' },
    { name: 'Education', icon: 'book', color: '#6366F1' },
    { name: 'Other', icon: 'more-horizontal', color: '#6B7280' },
  ];

  const selected = type === 'gelir' ? incomeCategories : expenseCategories;

  return selected.map((cat) => ({
    ...cat,
    type,
    user_id: user.id,
  }));
};
