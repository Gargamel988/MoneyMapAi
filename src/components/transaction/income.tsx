import { QUERY_KEYS } from "@/src/constants/queryKeys";
import { showErrorToast, showSuccessToast } from "@/src/constants/toast";
import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useResponsive";
import { getUserIncomeCategories } from "@/src/lib/category";
import { getCurrency } from "@/src/lib/profile";
import { getUser, transactionsApi } from "@/src/lib/transactions";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { IncomeFormData, incomeSchema } from "../../schemas/transactionSchemas";
import { formatTotal } from "../../utils/total";
import ModalCategory from "../categories/modal-category";
import { AmountInput } from "./income/amount-input";
import { CategorySelector } from "./income/category-selector";
import { DateTimeInput } from "./income/date-time-input";
import { IncomeHeader } from "./income/income-header";
import { SectionCard } from "./shared/section-card";
import { SectionLabel } from "./shared/section-label";

const incomeApi = (t: (key: string) => string) => ({
  createIncome: async (incomeData: IncomeFormData) => {
    const user = await getUser();
    if (!user || !user.id) throw new Error(t("income.error.session"));
    const data = await transactionsApi.addTransaction({
      user_id: user.id,
      category_id: incomeData.category_id,
      total_amount: incomeData.total_amount,
      date: incomeData.date.toISOString().split("T")[0],
      time: incomeData.time.toString(),
      type: "gelir",
      description: incomeData.description || null,
    });
    return data;
  },
  getIncomeCategories: async () => {
    const data = await getUserIncomeCategories();
    return data;
  },
});

interface IncomeEntryProps {
  prefilledData?: any;
}

export const IncomeEntry: React.FC<IncomeEntryProps> = ({ prefilledData }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions, hp } = useResponsive();
  const [displayValue, setDisplayValue] = useState("");
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const incomeApiInstance = incomeApi(t);
  const { control, handleSubmit, reset, formState } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      category_id: "",
      total_amount: 0,
      date: new Date(),
      time: new Date().toISOString().split("T")[1],
      description: "",
    },
  });

  // Handle prefilled data from PDF/CSV
  React.useEffect(() => {
    if (prefilledData && prefilledData.type === 'gelir') {
      const amount = Math.abs(prefilledData.amount);
      if (amount > 0) {
        setDisplayValue(amount.toString());
      }
      
      reset({
        ...formState.defaultValues,
        total_amount: amount,
        description: prefilledData.note 
          ? `${prefilledData.description} - ${prefilledData.note}`
          : prefilledData.description || "",
        date: prefilledData.date ? new Date(prefilledData.date) : new Date(),
      });
    }
  }, [prefilledData]);

  const [income_categoriesQuery, currencyQuery] = useQueries({
    queries: [
      {
        queryKey: QUERY_KEYS.categories.income(),
        queryFn: incomeApiInstance.getIncomeCategories,
      },
      {
        queryKey: QUERY_KEYS.user.currency(),
        queryFn: getCurrency,
      },
    ],
  });

  const currency = currencyQuery?.data?.currency || "TRY";
  const incomeCategories = income_categoriesQuery?.data;
  const categoriesLoading = income_categoriesQuery?.isLoading;

  const createIncomeMutation = useMutation({
    mutationFn: incomeApiInstance.createIncome,
    onSuccess: (data) => {
      showSuccessToast(
        t("income.success.title"),
        t("income.success.message", {
          amount: formatTotal(data?.data.total_amount, currency),
        })
      );
      reset({
        category_id: "",
        total_amount: 0,
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        description: "",
      });
      setDisplayValue("");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
    },
    onError: (error) => {
      showErrorToast(t("income.error.title"), error.message);
    },
  });

  const onSubmit = (data: IncomeFormData) => createIncomeMutation.mutate(data);

  const isSubmitDisabled =
    !!Object.keys(formState.errors).length ||
    createIncomeMutation.isPending ||
    categoriesLoading ||
    authLoading ||
    !user;

  if (showAddForm) {
    return (
      <ModalCategory
        visible
        onClose={() => setShowAddForm(false)}
        edit={false}
      />
    );
  }

  return (
    <View style={{ gap: dimensions.md }}>
      <IncomeHeader
        t={t}
        theme={theme}
        dimensions={dimensions}
        onAddCategory={() => setShowAddForm(true)}
      />

      <CategorySelector
        control={control}
        incomeCategories={incomeCategories}
        categoriesLoading={categoriesLoading}
        t={t}
        theme={theme}
        dimensions={dimensions}
        errors={formState.errors}
      />

      <AmountInput
        control={control}
        currency={currency}
        displayValue={displayValue}
        setDisplayValue={setDisplayValue}
        isPending={createIncomeMutation.isPending}
        t={t}
        theme={theme}
        dimensions={dimensions}
        hp={hp}
        errors={formState.errors}
      />

      <SectionCard theme={theme} dimensions={dimensions}>
        <SectionLabel
          icon="file-text"
          label={`${t("income.description")} ${t("income.optional")}`}
          theme={theme}
          dimensions={dimensions}
          success
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value || ""}
              onChangeText={onChange}
              placeholder={t("income.descriptionPlaceholder")}
              placeholderTextColor={theme.textTertiary}
              editable={!createIncomeMutation.isPending}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: theme.inputbackground,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.border,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: dimensions.fontMD,
                color: theme.textSenary,
                textAlignVertical: "top",
                minHeight: hp(10),
              }}
            />
          )}
        />
      </SectionCard>

      <DateTimeInput
        control={control}
        isDateOpen={isDateOpen}
        setIsDateOpen={setIsDateOpen}
        isTimeOpen={isTimeOpen}
        setIsTimeOpen={setIsTimeOpen}
        isPending={createIncomeMutation.isPending}
        t={t}
        theme={theme}
        dimensions={dimensions}
      />

      {Object.keys(formState.errors).length > 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: `${theme.error}10`,
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: `${theme.error}30`,
          }}
        >
          <Feather name="alert-circle" size={18} color={theme.error} />
          <Text
            style={{
              flex: 1,
              fontSize: dimensions.fontSM,
              color: theme.error,
            }}
          >
            {t("income.error.fillFields")}
          </Text>
        </View>
      )}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitDisabled}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          backgroundColor: theme.success,
          borderRadius: 14,
          paddingVertical: 16,
          opacity: isSubmitDisabled ? 0.6 : 1,
          transform: [{ scale: pressed && !isSubmitDisabled ? 0.98 : 1 }],
        })}
      >
        {createIncomeMutation.isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Feather name="check-circle" size={20} color="#fff" />
        )}
        <Text
          style={{
            fontSize: dimensions.fontLG,
            fontWeight: "700",
            color: "#fff",
          }}
        >
          {createIncomeMutation.isPending
            ? t("income.adding")
            : t("income.submit")}
        </Text>
      </Pressable>
    </View>
  );
};
