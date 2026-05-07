import { supabase } from "./supabase";
import { getUser } from "./transactions";
import { NotificationService } from "../services/notificationService";

export interface BudgetGoal {
  id?: string;
  user_id?: string;
  title: string;
  target_amount: number;
  current_amount?: number;
  category_id?: string;
  deadline?: string;
  created_at?: string;
}

export const goalsApi = {
  getGoals: async (): Promise<BudgetGoal[]> => {
    const user = await getUser();
    if (!user?.id) return [];

    const { data, error } = await supabase
      .from("budget_goals")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.warn("budget_goals table might not exist, using empty array");
      return [];
    }
    return data || [];
  },

  createGoal: async (goal: BudgetGoal) => {
    const user = await getUser();
    if (!user?.id) throw new Error("User not found");

    const { data, error } = await supabase
      .from("budget_goals")
      .insert([
        {
          ...goal,
          user_id: user.id,
          current_amount: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  findGoalByCategory: async (categoryId: string): Promise<BudgetGoal | null> => {
    const user = await getUser();
    if (!user?.id) return null;

    const { data, error } = await supabase
      .from("budget_goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("category_id", categoryId)
      .maybeSingle();

    if (error) return null;
    return data;
  },

  updateGoalAmount: async (id: string, amount: number) => {
    // First fetch current value
    const { data: current, error: fetchErr } = await supabase
      .from("budget_goals")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchErr) throw fetchErr;

    const newAmount = Math.max(0, (current?.current_amount ?? 0) + amount);
    const targetAmount = current?.target_amount ?? 0;

    // Check thresholds before updating
    if (targetAmount > 0) {
      const oldPercentage = ((current?.current_amount ?? 0) / targetAmount) * 100;
      const newPercentage = (newAmount / targetAmount) * 100;

      if (oldPercentage < 100 && newPercentage >= 100) {
        NotificationService.sendBudgetAlert(current.title, 100);
      } else if (oldPercentage < 80 && newPercentage >= 80) {
        NotificationService.sendBudgetAlert(current.title, 80);
      }
    }

    const { data, error } = await supabase
      .from("budget_goals")
      .update({ current_amount: newAmount })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteGoal: async (id: string) => {
    const { error } = await supabase.from("budget_goals").delete().eq("id", id);

    if (error) throw error;
  },
};
