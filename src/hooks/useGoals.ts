import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../lib/goals';

export const useGoals = () => {
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsApi.getGoals,
  });

  const createGoalMutation = useMutation({
    mutationFn: goalsApi.createGoal,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      goalsApi.updateGoalAmount(id, amount),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: goalsApi.deleteGoal,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); },
  });

  return {
    goals,
    isLoading,
    createGoal: createGoalMutation.mutateAsync,
    isCreating: createGoalMutation.isPending,
    updateGoalAmount: (id: string, amount: number) => updateGoalMutation.mutateAsync({ id, amount }),
    isUpdating: updateGoalMutation.isPending,
    deleteGoal: deleteGoalMutation.mutateAsync,
    isDeleting: deleteGoalMutation.isPending,
  };
};
