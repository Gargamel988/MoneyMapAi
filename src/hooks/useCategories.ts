import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { showErrorToast, showSuccessToast } from "../constanst/toast";
import {
  addCustomCategory,
  deleteCategory,
  updateCategory,
} from "../lib/addCategories";
import { getUserallCategories } from "../lib/category";
import { Category } from "../types/transactıonstype";

export const useCategories = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const {data, error, isLoading, refetch} = useQuery({
    queryKey: ["categories"],
    queryFn: () => getUserallCategories(),
  });

  const addCategoryMutation = useMutation({
    mutationFn: (categoryData: Category) => addCustomCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["piechartData"] });
      queryClient.invalidateQueries({ queryKey: ["income_categories"] });
      queryClient.invalidateQueries({ queryKey: ["expense_categories"] });

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
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["piechartData"] });
      queryClient.invalidateQueries({ queryKey: ["income_categories"] });
      queryClient.invalidateQueries({ queryKey: ["expense_categories"] });
      showSuccessToast(t('common.success'), t('categories.update.success'));
    },
    onError: (error: Error) => {
      showErrorToast(t('common.error'), error.message);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["piechartData"] });
      queryClient.invalidateQueries({ queryKey: ["income_categories"] });
      queryClient.invalidateQueries({ queryKey: ["expense_categories"] });
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