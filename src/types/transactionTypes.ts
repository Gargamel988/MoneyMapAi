export type TransactionType = 'gider' | 'gelir';

export interface Category {
  color: string;
  created_at: string;
  icon: string;
  id: string;
  name: string;
  type: TransactionType;
  updated_at: string;
  user_id: string;
}

export interface ExpenseItem {

  [key: string]: any;
}

export interface Transaction {
  categories: Category;
  category_id: string;
  created_at: string;
  date: string;
  description: string;
  expense_items: ExpenseItem[]; 
  id: string;
  time: string;
  total_amount: number;
  type: TransactionType;
  updated_at: string;
  user_id: string;
}

export type TransactionList = Transaction[];