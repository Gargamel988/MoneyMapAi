import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "../constanst/toast";
import {
  addCustomCategory,
  deleteCategory,
  updateCategory,
} from "../lib/addCategories";
import { getUserallCategories } from "../lib/category";
import { Category } from "../types/transactıonstype";

export const useCategories = () => {
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

      showSuccessToast("Başarılı", "Kategori başarıyla eklendi");
    },
    onError: (error: Error) => {
      showErrorToast("Hata", error.message);
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
      showSuccessToast("Başarılı", "Kategori güncellendi");
    },
    onError: (error: Error) => {
      showErrorToast("Hata", error.message);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["piechartData"] });
      queryClient.invalidateQueries({ queryKey: ["income_categories"] });
      queryClient.invalidateQueries({ queryKey: ["expense_categories"] });
      showSuccessToast('Kategori başarıyla silindi');
    },
    onError: (error: any) => {
      // Custom error code kontrolü
      if (error.code === 'CATEGORY_IN_USE') {
     showErrorToast('Kategori Silinemedi', error.message);
      } else {
       showErrorToast('Hata', error.message || 'Kategori silinirken bir hata oluştu');
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