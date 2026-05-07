export type DebtType = 'alacak' | 'borç';
export type DebtStatus = 'beklemede' | 'ödendi';

export interface Debt {
  id: string;
  user_id: string;
  person_name: string;
  amount: number;
  type: DebtType;
  status: DebtStatus;
  due_date: string | null;
  description: string | null;
  is_installment: boolean;
  total_installments: number;
  remaining_installments: number;
  created_at: string;
  updated_at: string;
}

export type DebtList = Debt[];
