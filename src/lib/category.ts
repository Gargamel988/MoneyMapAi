import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { createDefaultCategories } from "../utils/defaultcategories";
import { getUser } from "./transactions";
export const insertDefaultExpenseCategories = async (user: User) => {
  try {
    const { data: newCategories, error: insertError } = await supabase
      .from("categories")
      .insert(createDefaultCategories(user, "gider"))
      .select();

    if (insertError) {
      console.error('Expense categories insert error:', insertError);
      // RLS hatası durumunda boş array döndür
      if (insertError.code === '42501') {
        console.warn('RLS policy violation - categories may already exist or user lacks permissions');
        return { data: [], error: null };
      }
    }

    return { data: newCategories, error: insertError };
  } catch (error) {
    console.error('Unexpected error in insertDefaultExpenseCategories:', error);
    return { data: [], error: error as any };
  }
};

export const insertDefaultIncomeCategories = async (user: User) => {
  try {
    const { data: newCategories, error: insertError } = await supabase
      .from("categories")
      .insert(createDefaultCategories(user, "gelir"))
      .select();
    
    if (insertError) {
      console.error('Income categories insert error:', insertError);
      // RLS hatası durumunda boş array döndür
      if (insertError.code === '42501') {
        console.warn('RLS policy violation - categories may already exist or user lacks permissions');
        return { data: [], error: null };
      }
    }
    
    return { data: newCategories, error: insertError };
  } catch (error) {
    console.error('Unexpected error in insertDefaultIncomeCategories:', error);
    return { data: [], error: error as any };
  }
};

export const getUserexpenseCategories = async () => {
  const user = await getUser();

  // User ID kontrolü
  if (!user?.id) {
    return { data: [], error: { message: "User not authenticated" } };
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`*`)
    .eq("type", "gider")
    .eq("user_id", user.id)
    .order("name");

  // Eğer kategori yoksa, oluştur ve döndür
  if (!categories || categories.length === 0) {
    console.log("No expense categories found, creating default ones...");
    const { data: newCategories, error: insertError } =
      await insertDefaultExpenseCategories(user);
    

    
    return { data: newCategories, error: insertError };
  }

  return { data: categories, error };
};
export const getUserincomeCategories = async () => {
  const user = await getUser();

  // User ID kontrolü
  if (!user?.id) {
    return { data: [], error: { message: "User not authenticated" } };
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`*`)
    .eq("type", "gelir")
    .eq("user_id", user.id)
    .order("name");

  // Eğer kategori yoksa, oluştur ve döndür
  if (!categories || categories.length === 0) {
    console.log("No income categories found, creating default ones...");
    const { data: newCategories, error: insertError } = 
      await insertDefaultIncomeCategories(user);
    
    // RLS hatası durumunda varsayılan kategorileri döndür
    if (insertError && insertError.code === '42501') {
      console.warn("RLS policy violation - returning default categories without saving");
      const defaultCategories = createDefaultCategories(user, "gelir");
      return { data: defaultCategories, error: null };
    }
    
    return { data: newCategories, error: insertError };
  }

  return { data: categories, error };
};
export const getUserallCategories = async () => {
  const user = await getUser();

  // User ID kontrolü
  if (!user?.id) {
    return { data: [], error: { message: "User not authenticated" } };
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`*`)
    .eq("user_id", user.id)
    .order("name");
  return { data: categories, error };
};
