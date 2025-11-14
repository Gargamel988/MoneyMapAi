import { User } from "@supabase/supabase-js";
import i18next from "../../services/i18next";
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

// Dil değiştiğinde varsayılan kategorileri güncelle
export const updateDefaultCategoriesByLanguage = async (newLanguage: string) => {
  try {
    const user = await getUser();
    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Yeni dile göre varsayılan kategorileri oluştur (i18n kullanarak)
    const t = i18next.getFixedT(newLanguage);
    
    const defaultIncomeCategories = [
      { name: t('categories.default.income.salary'), icon: 'dollar-sign', color: '#10B981', type: 'gelir', user_id: user.id },
      { name: t('categories.default.income.freelance'), icon: 'briefcase', color: '#3B82F6', type: 'gelir', user_id: user.id },
      { name: t('categories.default.income.investment'), icon: 'trending-up', color: '#8B5CF6', type: 'gelir', user_id: user.id },
      { name: t('categories.default.income.bonus'), icon: 'gift', color: '#F59E0B', type: 'gelir', user_id: user.id },
      { name: t('categories.default.income.sales'), icon: 'shopping-bag', color: '#06B6D4', type: 'gelir', user_id: user.id },
      { name: t('categories.default.income.rent'), icon: 'home', color: '#EC4899', type: 'gelir', user_id: user.id },
      { name: t('categories.default.income.other'), icon: 'more-horizontal', color: '#6B7280', type: 'gelir', user_id: user.id },
    ];

    const defaultExpenseCategories = [
      { name: t('categories.default.expense.market'), icon: 'shopping-cart', color: '#EF4444', type: 'gider', user_id: user.id },
      { name: t('categories.default.expense.transportation'), icon: 'truck', color: '#F59E0B', type: 'gider', user_id: user.id },
      { name: t('categories.default.expense.bills'), icon: 'file-text', color: '#3B82F6', type: 'gider', user_id: user.id },
      { name: t('categories.default.expense.rent'), icon: 'home', color: '#8B5CF6', type: 'gider', user_id: user.id },
      { name: t('categories.default.expense.entertainment'), icon: 'film', color: '#EC4899', type: 'gider', user_id: user.id },
      { name: t('categories.default.expense.health'), icon: 'heart', color: '#10B981', type: 'gider', user_id: user.id },
      { name: t('categories.default.expense.clothing'), icon: 'shopping-bag', color: '#06B6D4', type: 'gider', user_id: user.id },
      { name: t('categories.default.expense.food'), icon: 'coffee', color: '#F97316', type: 'gider', user_id: user.id },
      { name: t('categories.default.expense.education'), icon: 'book', color: '#6366F1', type: 'gider', user_id: user.id },
      { name: t('categories.default.expense.other'), icon: 'more-horizontal', color: '#6B7280', type: 'gider', user_id: user.id },
    ];
    
    // Tüm varsayılan kategorileri birleştir (icon ve color ile eşleştirme için)
    const allDefaultCategories = [...defaultIncomeCategories, ...defaultExpenseCategories];
    
    // Kullanıcının mevcut kategorilerini al
    const { data: existingCategories, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id);

    if (fetchError) {
      console.error("Error fetching categories:", fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!existingCategories || existingCategories.length === 0) {
      return { success: true, updated: 0 };
    }

    // Varsayılan kategorileri icon ve color kombinasyonuna göre eşleştir ve güncelle
    const updatePromises: Promise<any>[] = [];
    let updatedCount = 0;

    for (const existingCategory of existingCategories) {
      // Icon ve color kombinasyonuna göre varsayılan kategorilerden birini bul
      const matchingDefault = allDefaultCategories.find(
        (defaultCat) =>
          defaultCat.icon === existingCategory.icon &&
          defaultCat.color === existingCategory.color &&
          defaultCat.type === existingCategory.type
      );

      if (matchingDefault && existingCategory.name !== matchingDefault.name) {
        // Kategori ismini yeni dile göre güncelle
        const updatePromise = (async () => {
          const { error } = await supabase
            .from("categories")
            .update({ name: matchingDefault.name })
            .eq("id", existingCategory.id)
            .eq("user_id", user.id);
          
          if (error) {
            console.error(`Error updating category ${existingCategory.id}:`, error);
          }
          return { error };
        })();
        
        updatePromises.push(updatePromise);
        updatedCount++;
      }
    }

    // Tüm güncellemeleri paralel olarak yap
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    return { success: true, updated: updatedCount };
  } catch (error) {
    console.error("Error updating categories by language:", error);
    return { success: false, error: (error as Error).message };
  }
};
