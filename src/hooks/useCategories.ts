import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { QUERY_KEYS } from "../constants/queryKeys";
import { showErrorToast, showSuccessToast } from "../constants/toast";
import {
  addCustomCategory,
  deleteCategory,
  updateCategory,
} from "../lib/addCategories";
import { getUserAllCategories } from "../lib/category";
import { Category } from "../types/transactionTypes";

export const useCategories = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const {data, error, isLoading, refetch} = useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: () => getUserAllCategories(),
  });

  const addCategoryMutation = useMutation({
    mutationFn: (categoryData: Category) => addCustomCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.stats() });

      showSuccessToast(t('common.success'), t('categories.add.success'));
    },
    onError: (error: Error) => {
      showErrorToast(t('common.error'), error.message);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
      updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.stats() });
      showSuccessToast(t('common.success'), t('categories.update.success'));
    },
    onError: (error: Error) => {
      showErrorToast(t('common.error'), error.message);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.stats() });
      showSuccessToast(t('common.success'), t('categories.delete.success'));
    },
    onError: (error: any) => {
      // Custom error code kontrolü
      if (error.code === 'CATEGORY_IN_USE') {
     showErrorToast(t('categories.delete.failed'), error.message);
      } else {
       showErrorToast(t('common.error'), error.message || t('categories.delete.error'));
      }
    },
  });

  return { 
    data, 
    error, 
    isLoading, 
    addCategoryMutation, 
    updateCategoryMutation, 
    deleteCategoryMutation, 
    refetch 
  };
};