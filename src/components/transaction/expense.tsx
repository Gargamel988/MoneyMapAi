import { QUERY_KEYS } from "@/src/constants/queryKeys";
import { showErrorToast, showSuccessToast } from "@/src/constants/toast";
import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useResponsive";
import { getUserExpenseCategories } from "@/src/lib/category";
import { getCurrency } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";
import { transactionsApi } from "@/src/lib/transactions";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { ExpenseData, expenseSchema } from "../../schemas/transactionSchemas";
import { formatTotal } from "../../utils/total";
import ModalCategory from "../categories/modal-category";
import { CategorySelector } from "./expense/category-selector";
import { DateTimeInput } from "./expense/date-time-input";
import { ExpenseHeader } from "./expense/expense-header";
import { ItemForm } from "./expense/item-form";
import { ItemList } from "./expense/item-list";
import { SectionCard } from "./shared/section-card";
import { SectionLabel } from "./shared/section-label";

export const ExpenseEntry: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions, hp } = useResponsive();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [list, setList] = useState<
    { itemName: string; price: number; quantity: number }[]
  >([]);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<{
    itemName: string;
    price: number;
    priceString: string;
    quantity: number;
  }>({ itemName: "", price: 0, priceString: "", quantity: 1 });

  const [expense_categoriesQuery, currencyQuery] = useQueries({
    queries: [
      {
        queryKey: QUERY_KEYS.categories.expense(),
        queryFn: getUserExpenseCategories,
      },
      {
        queryKey: QUERY_KEYS.user.currency(),
        queryFn: getCurrency,
      },
    ],
  });

  const { control, handleSubmit, reset, formState, setValue } =
    useForm<ExpenseData>({
      resolver: zodResolver(expenseSchema),
      defaultValues: {
        category_id: "",
        urun: [],
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        description: "",
      },
    });

  const currency = currencyQuery?.data?.currency || "TRY";
  const expenseCategories = expense_categoriesQuery?.data;
  const categoriesLoading = expense_categoriesQuery?.isLoading;

  const addExpenseMutation = useMutation({
    mutationFn: async (formData: ExpenseData) => {
      const totalAmount = list.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const transactionData = await transactionsApi.addTransaction({
        category_id: formData.category_id,
        total_amount: totalAmount,
        date: formData.date.toISOString().split("T")[0],
        time: formData.time.toString(),
        type: "gider",
        description: formData.description,
      });

      if (
        !transactionData ||
        !transactionData.data ||
        !transactionData.data.id
      ) {
        throw new Error(t("expense.error.transaction"));
      }

      const expenseItems = list.map((item) => ({
        transaction_id: transactionData.data.id,
        item_name: item.itemName,
        unit_price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("expense_items")
        .insert(expenseItems);

      if (itemsError) throw itemsError;

      return transactionData.data;
    },
    onSuccess: () => {
      const totalAmount = list.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });

      showSuccessToast(
        t("expense.success.title"),
        t("expense.success.message", {
          amount: formatTotal(totalAmount, currency),
        })
      );

      setList([]);
      reset({
        category_id: "",
        urun: [],
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        description: "",
      });
      setCurrentItem({ itemName: "", price: 0, priceString: "", quantity: 1 });
    },
    onError: (error: Error) => {
      showErrorToast(t("common.error"), error.message);
    },
  });

  const addItem = () => {
    if (
      !currentItem.itemName ||
      currentItem.price <= 0 ||
      currentItem.quantity < 1
    ) {
      return;
    }

    const newItem = {
      itemName: currentItem.itemName,
      price: Number(currentItem.price),
      quantity: Number(currentItem.quantity),
    };

    const updatedList = [...list, newItem];
    setList(updatedList);
    setValue("urun", updatedList);
    setCurrentItem({ itemName: "", price: 0, priceString: "", quantity: 1 });
  };

  const removeItem = (index: number) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    setValue("urun", updatedList);
  };

  const onSubmit = (data: ExpenseData) => {
    addExpenseMutation.mutate(data);
  };

  const totalAmount = list.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
      <ExpenseHeader
        t={t}
        theme={theme}
        dimensions={dimensions}
        onAddCategory={() => setShowAddForm(true)}
      />

      <CategorySelector
        control={control}
        expenseCategories={expenseCategories}
        categoriesLoading={categoriesLoading}
        t={t}
        theme={theme}
        dimensions={dimensions}
        errors={formState.errors}
      />

      <ItemForm
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
        addItem={addItem}
        currency={currency}
        isPending={addExpenseMutation.isPending}
        t={t}
        theme={theme}
        dimensions={dimensions}
      />

      <ItemList
        list={list}
        removeItem={removeItem}
        totalAmount={totalAmount}
        currency={currency}
        isPending={addExpenseMutation.isPending}
        t={t}
        theme={theme}
        dimensions={dimensions}
        hp={hp}
      />

      <SectionCard theme={theme} dimensions={dimensions}>
        <SectionLabel
          icon="file-text"
          label={`${t("expense.description")} ${t("expense.optional")}`}
          theme={theme}
          dimensions={dimensions}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <TextInput
              placeholder={t("expense.descriptionPlaceholder")}
              placeholderTextColor={theme.textTertiary}
              style={{
                backgroundColor: theme.inputbackground,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: dimensions.fontMD,
                color: theme.textSenary,
                textAlignVertical: "top",
                minHeight: hp(8),
              }}
              value={value || ""}
              onChangeText={onChange}
              editable={!addExpenseMutation.isPending}
              multiline
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
        isPending={addExpenseMutation.isPending}
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
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: dimensions.fontSM,
                fontWeight: "600",
                color: theme.error,
              }}
            >
              {t("expense.missingFields")}
            </Text>
            {Object.entries(formState.errors).map(([field, error]) => (
              <Text
                key={field}
                style={{
                  fontSize: dimensions.fontXS,
                  color: theme.error,
                  marginTop: 2,
                }}
              >
                • {error?.message || t("expense.fieldRequired")}
              </Text>
            ))}
          </View>
        </View>
      )}

      <Pressable
        onPress={handleSubmit((data) => onSubmit(data as ExpenseData))}
        disabled={
          addExpenseMutation.isPending || list.length === 0 || categoriesLoading
        }
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          backgroundColor: theme.error,
          borderRadius: 14,
          paddingVertical: 16,
          opacity:
            addExpenseMutation.isPending ||
              list.length === 0 ||
              categoriesLoading
              ? 0.6
              : 1,
          transform: [
            {
              scale:
                pressed &&
                  !(
                    addExpenseMutation.isPending ||
                    list.length === 0 ||
                    categoriesLoading
                  )
                  ? 0.98
                  : 1,
            },
          ],

        })}
      >
        {addExpenseMutation.isPending ? (
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
          {addExpenseMutation.isPending
            ? t("expense.saving")
            : t("expense.submit")}
        </Text>
      </Pressable>
    </View>
  );
};
