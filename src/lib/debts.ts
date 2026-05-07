import { Debt, DebtList } from "../types/debtTypes";
import { supabase } from "./supabase";

export const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const debtsApi = {
  getDebts: async (): Promise<DebtList> => {
    const user = await getUser();
    if (!user) throw new Error("User not found");

    const { data, error } = await supabase
      .from("debts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: currency } = await supabase
      .from("profiles")
      .select("currency")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    const finalData: DebtList = data.map((debt) => {
      return { ...debt, currency: currency?.currency };
    });
    return finalData || [];
  },

  addDebt: async (debtData: Partial<Debt>): Promise<Debt> => {
    const user = await getUser();
    if (!user) throw new Error("User not found");

    const { data, error } = await supabase
      .from("debts")
      .insert([{ ...debtData, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateDebtStatus: async (
    id: string,
    status: "beklemede" | "ödendi",
  ): Promise<void> => {
    const { error } = await supabase
      .from("debts")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },

  updateDebt: async (id: string, debtData: Partial<Debt>): Promise<void> => {
    const { error } = await supabase
      .from("debts")
      .update({ ...debtData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  },

  payInstallment: async (id: string): Promise<void> => {
    // Önce mevcut borcu al
    const { data: debt, error: fetchError } = await supabase
      .from("debts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !debt) throw fetchError || new Error("Debt not found");

    const newRemaining = Math.max(0, debt.remaining_installments - 1);
    const newStatus = newRemaining === 0 ? "ödendi" : "beklemede";

    const { error } = await supabase
      .from("debts")
      .update({
        remaining_installments: newRemaining,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  },

  deleteDebt: async (id: string): Promise<void> => {
    const { error } = await supabase.from("debts").delete().eq("id", id);

    if (error) throw error;
  },
};
