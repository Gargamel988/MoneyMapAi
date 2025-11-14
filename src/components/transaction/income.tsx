import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showErrorToast, showSuccessToast } from "../../constanst/toast";
import { useTheme } from "../../contexts/theme";
import { useAuth } from "../../hooks/useAuth";
import { hp, useResponsive, wp } from "../../hooks/useRespons";
import { getUserincomeCategories } from "../../lib/category";
import { getCurrency } from "../../lib/profil";
import { getUser, transactionsApi } from "../../lib/transactions";
import { IncomeFormData, incomeSchema } from "../../schemas/transactionSchemas";
import { Category } from "../../types/transactıonstype";
import { formatDate, formatTime } from "../../utils/date";
import { formatTotal } from "../../utils/total";
import ModalCategory from "../categories/modal-category";

const incomeApi = (t: (key: string) => string) => ({
  createIncome: async (incomeData: IncomeFormData) => {
    const user = await getUser();
    if (!user || !user.id)
      throw new Error(
        t("income.error.session")
      );
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
    const data = await getUserincomeCategories();
    return data;
  },
});

export const IncomeEntry = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions, isTablet } = useResponsive();

  
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  
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

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

const [ income_categoriesQuery, currencyQuery] =useQueries({
  queries: [
    {
      queryKey: ["income_categories"],
      queryFn: incomeApiInstance.getIncomeCategories,
    },
    {
      queryKey: ["currency"],
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
          amount: formatTotal(
            data?.data.total_amount,
            currency
          ),
        })
      );
      reset({
        category_id: "",
        total_amount: 0,
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        description: "",
      });
      queryClient.invalidateQueries({ queryKey: ["transactionsByLastprocess"] });
      queryClient.invalidateQueries({ queryKey: ["twoweeksAgoData"] });
      queryClient.invalidateQueries({ queryKey: ["yearsincome"] });
      queryClient.invalidateQueries({ queryKey: ["piechartData"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
    <View
      style={{
        width: "100%",
        alignSelf: "center",
        borderWidth: 1,
        borderRadius: dimensions.borderRadiusXL,
        borderColor: theme.border,
        backgroundColor: theme.incomebackground,
        shadowColor:"black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        padding: dimensions.md,
      }}
    >
      {/* Header */}
      <View
        style={{
          marginBottom: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: dimensions.sm,
          }}
        >
          <View
            style={{
              backgroundColor: theme.incomebackgroundicon + "20",
              borderRadius: dimensions.borderRadiusLG,
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="trending-up" size={24} color={theme.success} />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: theme.text,
            }}
          >
            {t("income.title")}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 99,
            padding: dimensions.sm,
            backgroundColor: theme.white,
          }}
          onPress={() => {
            setShowAddForm(true);
          }}
        >
          <Feather name="plus" size={24} color={theme.textTertiary} />
          <Text
            style={{ color: theme.textTertiary, fontSize: dimensions.fontXS }}
          >
            {t("income.addCategory")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 20 }}>
        {/* Kategori Kartı */}
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: dimensions.borderRadiusXL,
            padding: dimensions.md,
          }}
        >
          <Text
            style={{
              color: theme.textSecondary,
              fontSize: dimensions.fontMD,
              fontWeight: "bold",
              marginBottom: dimensions.sm,
            }}
          >
            {t("income.selectCategory")}
          </Text>
          <Controller
            control={control}
            name="category_id"
            render={({ field: { onChange, value } }) => (
              <View
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  padding: 12,
                  borderColor: theme.border,
                  backgroundColor: theme.input,
                }}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ paddingHorizontal: dimensions.sm }}
                >
                  {categoriesLoading ? (
                    <Text
                      style={{
                        color: theme.textSecondary,
                        fontSize: dimensions.fontSM,
                        padding: dimensions.sm,
                      }}
                    >
                      {t("income.loading")}
                    </Text>
                  ) : (
                    incomeCategories?.data?.map((category: Category) => (
                      <Pressable
                        key={category.id}
                        onPress={() => onChange(category.id.toString())}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          marginRight: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: dimensions.borderRadiusLG,
                          borderWidth: 1,
                          borderColor: category.color,
                          backgroundColor:
                            value === category.id.toString()
                              ? category.color
                              : theme.input,
                        }}
                      >
                        <Feather
                          name={category.icon as any}
                          size={dimensions.iconSM}
                          color={
                            value === category.id.toString()
                              ? theme.white
                              : category.color
                          }
                        />
                        <Text
                          style={{
                            fontSize: dimensions.fontMD,
                            color:
                              value === category.id.toString()
                                ? theme.white
                                : theme.textTertiary
                          }}
                        >
                          {category.name}
                        </Text>
                      </Pressable>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          />
          {formState.errors.category_id && (
            <Text style={{ color: theme.error, fontSize: dimensions.fontSM }}>
              {formState.errors.category_id.message}
            </Text>
          )}
        </View>

        {/* Tutar Kartı */}
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: dimensions.borderRadiusXL,
            padding: dimensions.md,
          }}
        >
          <Text
            style={{
              fontSize: dimensions.fontMD,
              fontWeight: "bold",
              color: theme.textSecondary,
              marginBottom: dimensions.sm,
            }}
          >
            {t("income.amount")}
          </Text>
          <View >
            <Text
              style={{
                position: "absolute",
                left: wp(4),
                top: hp(1.5),
                zIndex: 1,
                fontSize: dimensions.fontXXL,
                fontWeight: "bold",
                color: theme.textTertiary,
              }}
            >
              {currency === "TRY"
                ? "₺"
                : currency === "USD"
                ? "$"
                : currency === "EUR"
                ? "€"
                : currency === "GBP"
                ? "£"
                : currency === "JPY"
                ? "¥"
                : currency === "CNY"
                ? "¥"
                : currency}
            </Text>
            <Controller
              control={control}
              name="total_amount"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  keyboardType="decimal-pad"
                  value={value ? String(value) : ""}
                  onChangeText={(text) => {
                    const numValue = Number(text.replace(/,/g, ".")) || 0;
                    onChange(numValue);
                  }}
                  placeholder="0.00"
                  placeholderTextColor={theme.textTertiary}
                  editable={!createIncomeMutation.isPending}
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.input,
                    color: theme.textTertiary,
                    opacity: createIncomeMutation.isPending ? 0.5 : 1,
                    fontSize: isTablet ? dimensions.fontLG : dimensions.fontXL,
                    borderRadius: dimensions.borderRadiusXL,
                    paddingVertical: 12,
                    paddingHorizontal: 48,
                  }}
                />
              )}
            />
          </View>
          {formState.errors.total_amount && (
            <Text
              style={{ color: theme.error, fontSize: dimensions.fontSM, marginTop: dimensions.sm }}
            >
              {formState.errors.total_amount.message}
            </Text>
          )}
        </View>

        {/* Açıklama Kartı */}
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: dimensions.borderRadiusXL,
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: dimensions.fontMD,
              fontWeight: "bold",
              color: theme.textSecondary,
              marginBottom: dimensions.sm,
            }}
          >
            {t("income.description")}{" "}
            <Text
              style={{
                fontSize: dimensions.fontSM,
                color: theme.textSecondary,
              }}
            >
              {t("income.optional")}
            </Text>
          </Text>
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
                  borderRadius: dimensions.borderRadiusXL,
                  borderWidth: 1,
                  borderColor: theme.border,
                  backgroundColor: theme.input,
                  color: theme.textTertiary,
                  fontSize: dimensions.fontSM,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  opacity: createIncomeMutation.isPending ? 0.5 : 1,
                  textAlignVertical: "top",
                }}
              />
            )}
          />
        </View>

        {/* Tarih ve Saat Kartı */}
        <View
            style={{
              padding: dimensions.md,
              borderRadius: dimensions.borderRadiusXL,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.incomebackground,
            }}
          >
            <Text
              style={{
                fontWeight: "semibold",
                fontSize: dimensions.fontMD,
                color: theme.textSecondary,

              }}
            >
              {t("income.dateTime")}
            </Text>
            <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <>
                    <TouchableOpacity
                      onPress={() => setIsDateOpen(true)}
                      disabled={createIncomeMutation.isPending}
                      activeOpacity={1}
                      style={{ 
                        width: "50%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: theme.border,
                        backgroundColor: theme.input,
                        borderRadius: dimensions.borderRadiusLG,
                        padding: 12,
                      }}
                    >
                      <Feather
                        name="calendar"
                        size={dimensions.iconSM}
                        color={theme.textTertiary}
                      />
                      <Text
                        style={{
                          color: theme.textTertiary,
                          marginLeft: 8,
                          fontSize: dimensions.fontSM,
                        }}
                      >
                        {formatDate(value)}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDateOpen}
                      mode="date"
                      date={value}
                      onConfirm={(d) => {
                        onChange(d);
                        setIsDateOpen(false);
                      }}
                      onCancel={() => setIsDateOpen(false)}
                    />
                  </>
                )}
              />
              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <>
                    <TouchableOpacity
                      onPress={() => setIsTimeOpen(true)}
                      disabled={createIncomeMutation.isPending}
                      
                      activeOpacity={1}
                      style={{
                        width: "50%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        borderColor: theme.border,
                        backgroundColor: theme.input,
                        borderRadius: dimensions.borderRadiusLG,
                        padding: 12,
                      }}
                    >
                      <Feather
                        name="clock"
                        size={dimensions.iconSM}
                        color={theme.textTertiary}
                      />
                      <Text
                        style={{
                          color: theme.textTertiary,
                          marginLeft: 8,
                          fontSize: dimensions.fontSM,
                        }}
                      >
                        {formatTime(value.toTimeString())}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isTimeOpen}
                      mode="time"
                      date={value}
                      onConfirm={(d) => {
                        onChange(d);
                        setIsTimeOpen(false);
                      }}
                      onCancel={() => setIsTimeOpen(false)}
                    />
                  </>
                )}
              />
            </View>
            <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center" }}>
              <Feather
                name="info"
                size={dimensions.iconSM}
                color={theme.textQuaternary} 
              />
              <Text
                style={{ marginLeft: 8, fontSize: dimensions.fontXS, color: theme.textQuaternary }}
              >
                {t("income.dateTimeInfo")}
              </Text>
            </View>
          </View>

        {/* Hata Mesajı */}
        {Object.keys(formState.errors).length > 0 && (
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.error,
              backgroundColor: theme.incomebackgroundicon + "20",
              borderRadius: dimensions.borderRadiusXL,
              padding: 16,
            }}
          >
            <Text style={{ fontSize: dimensions.fontSM, color: theme.error }}>
              {t("income.error.fillFields")}
            </Text>
          </View>
        )}

        {/* Gönder Butonu */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitDisabled}
          style={{
            borderRadius: dimensions.borderRadiusXL,
            paddingVertical: 16,
            backgroundColor: theme.buttonprimary,
            opacity: isSubmitDisabled ? 0.7 : 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
          }}
        >
          {createIncomeMutation.isPending && (
            <Feather
              name="loader"
              size={dimensions.iconSM}
              color={theme.white}
            />
          )}
          <Text
            style={{
              fontSize: dimensions.fontLG,
              fontWeight: "bold",
              color: theme.white,
            }}
          >
            {createIncomeMutation.isPending ? t("income.adding") : t("income.submit")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
