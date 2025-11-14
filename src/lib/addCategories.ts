import i18next from "../../services/i18next";
import { supabase } from "../lib/supabase";
import { Category } from "../types/transactıonstype";
import { getUser } from "./transactions";

export const addCustomCategory = async (categoryData: Category) => {
	const user = await getUser();
	const { data, error } = await supabase
	  .from('categories')
	  .insert({
		user_id: user?.id,
		name: categoryData.name,
		icon: categoryData.icon,
		color: categoryData.color,
		type: categoryData.type,
	  });
	return { data, error };
  };
  
  export const updateCategory = async (
	categoryId: string, 
	updates: Partial<Category>
  ) => {
	const user = await getUser();
	const { data, error } = await supabase
	  .from('categories')
	  .update(updates)
	  .eq('id', categoryId)
	  .eq('user_id', user?.id)
	  .select()
	  .single();
	
	if (error) {
	  throw new Error(error.message); // Hata throw et!
	}
	
	return data;
  };
  
  export const deleteCategory = async (categoryId: string) => {
	const user = await getUser();
	
	// 1. Kullanım kontrolü
	const { data: usageCheck, error: checkError } = await supabase
	  .from('transactions')
	  .select('id')
	  .eq('category_id', categoryId)
	  .limit(1);
	
	if (checkError) {
	  throw new Error(checkError.message);
	}
	
	if (usageCheck && usageCheck.length > 0) {
	  const error = new Error(i18next.t('categories.delete.inUse'));
	  (error as any).code = 'CATEGORY_IN_USE'; // Custom error code
	  throw error;
	}
	
	// 2. Silme işlemi
	const { data, error } = await supabase
	  .from('categories')
	  .delete()
	  .eq('id', categoryId)
	  .eq('user_id', user?.id)
	  .select()
	  .single();
	
	if (error) {
	  throw new Error(error.message);
	}
	
	return data;
  };