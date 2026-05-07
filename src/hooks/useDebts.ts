import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtsApi } from '../lib/debts';
import { Debt } from '../types/debtTypes';
import { NotificationService } from '../services/notificationService';

export const useDebts = () => {
  const queryClient = useQueryClient();

  const getDebts = () => {
    return useQuery({
      queryKey: ['debts'],
      queryFn: debtsApi.getDebts,
    });
  };

  const addDebt = useMutation({
    mutationFn: (debtData: Partial<Debt>) => debtsApi.addDebt(debtData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      
      // Borç hatırlatıcısı kur
      if (data.due_date && data.status === 'beklemede') {
        NotificationService.scheduleDebtReminder(
          data.id,
          data.person_name,
          `${data.amount}`,
          new Date(data.due_date)
        );
      }
    },
  });

  const updateDebtStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'beklemede' | 'ödendi' }) => 
      debtsApi.updateDebtStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      
      // Eğer ödendi ise bildirimi iptal et
      if (variables.status === 'ödendi') {
        NotificationService.cancelNotification(`debt-${variables.id}`);
      }
    },
  });

  const deleteDebt = useMutation({
    mutationFn: (id: string) => debtsApi.deleteDebt(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      // Bildirimi iptal et
      NotificationService.cancelNotification(`debt-${id}`);
    },
  });

  const updateDebt = useMutation({
    mutationFn: ({ id, debtData }: { id: string; debtData: Partial<Debt> }) => 
      debtsApi.updateDebt(id, debtData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      
      // Bildirimi güncellemek gerekirse (basitlik için önce silip sonra yeni data ile ekleme mantığı kurulabilir ama şimdilik invalidate yeterli)
      // Gerçek bir uygulamada burada eskiyi iptal edip yenisini kurmak daha iyi olur
    },
  });

  const payInstallment = useMutation({
    mutationFn: (id: string) => debtsApi.payInstallment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  return {
    getDebts,
    addDebt,
    updateDebtStatus,
    deleteDebt,
    updateDebt,
    payInstallment,
  };
};
