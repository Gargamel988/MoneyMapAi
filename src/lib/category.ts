import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { getUser } from "./transactions";

export const getUserExpenseCategories = async () => {
  const user = await getUser();

  // User ID kontrolü
  if (!user?.id) {
    return { data: [], error: { message: "User not authenticated" } };
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`*`)
    .eq("type", "gider")
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .order("name");

  return { data: categories || [], error };
};

export const getUserIncomeCategories = async () => {
  const user = await getUser();

  // User ID kontrolü
  if (!user?.id) {
    return { data: [], error: { message: "User not authenticated" } };
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`*`)
    .eq("type", "gelir")
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .order("name");

  return { data: categories || [], error };
};

export const getUserAllCategories = async () => {
  const user = await getUser();

  // User ID kontrolü
  if (!user?.id) {
    return { data: [], error: { message: "User not authenticated" } };
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`*`)
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .order("name");
    
  return { data: categories || [], error };
};
