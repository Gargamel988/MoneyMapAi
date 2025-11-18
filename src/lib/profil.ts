import i18next from "../../services/i18next";
import { showErrorToast } from "../constanst/toast";
import { supabase } from "./supabase";
import { getUser } from "./transactions";

export const getProfil = async () => {
  const user = await getUser();

  if (!user?.id) {
    return { data: null };
  }

  const { data: insertedData, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    return { data: null };
  }
  return { data: insertedData };
};
export const updateProfil = async (data: any) => {
  const user = await getUser();

  if (!user?.id) {
    return null;
  }

  const { data: updatedData, error } = await supabase
    .from("profiles")
    .update(data)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) {
    return null;
  }
  return updatedData;
};
export const getCurrency = async () => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }
  const { data: currency, error } = await supabase
    .from("profiles")
    .select("currency")
    .eq("user_id", user.id)
    .single();
  if (error) {
    return null;
  }
  return currency;
};
export const updatecurrency = async (currency: string) => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }

  const { data: updatedData, error } = await supabase
    .from("profiles")
    .update({ currency })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("error", error);
    return null;
  }
  return updatedData;
};
export const insertProfil = async (data: any) => {
  try {

    const fullName = data.user_metadata?.name || "";
    const nameParts = fullName.split(" ");

    const profileData = {
      user_id: data.id,
      name: nameParts[0] || "",
      username: nameParts[1] || "",
      avatar_url: data.user_metadata?.avatar_url || "",
      email: data.email,
      currency: "TRY",
      theme: "system",
      language: "tr",
    };
    

    const { data: insertedData, error } = await supabase
      .from("profiles")
      .insert([profileData])
      .select();

    if (error) {
      console.error("Supabase insert hatası:", error);
      showErrorToast(i18next.t('profile.save.error'), error.message);
      return null;
    }

    return insertedData;
  } catch (err: any) {
    console.error("insertProfil hatası:", err);
    showErrorToast(i18next.t('common.error'), err.message || i18next.t('profile.save.error.general'));
    return null;
  }
};
export const getTheme = async () => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }
  const { data: theme, error } = await supabase
    .from("profiles")
    .select("theme")
    .eq("user_id", user.id)
    .single();
  if (error) {
    return null;
  }
  return theme;
};
export const updateTheme = async (theme: string) => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }
  const { data: updatedData, error } = await supabase
    .from("profiles")
    .update({ theme })
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) {
    return null;
  }
  return updatedData;
};
export const updatename= async (name: string) => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }
  const { data: updatedData, error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) {
    return null;
  }
  return updatedData;
};
export const updateusername = async (username: string) => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }
  const { data: updatedData, error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) {
    return null;
  }
  return updatedData;
};
export const updateAvatar = async (avatar: string) => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }
  const { data: updatedData, error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatar })
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) {
    return { data: null, error: error.message };
  }
  return updatedData;
};

export const getLanguage = async () => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }
  const { data: language, error } = await supabase
    .from("profiles")
    .select("language")
    .eq("user_id", user.id)
    .single();
  if (error) {
    return null;
  }
  return language;
};

export const updateLanguage = async (language: string) => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }

  const { data: updatedData, error } = await supabase
    .from("profiles")
    .update({ language })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("updateLanguage error", error);
    return null;
  }

  return updatedData;
};