import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Control, Controller } from "react-hook-form";
import { Theme } from "../../../contexts/theme";
import { Category } from "../../../types/transactionTypes";
import { SectionCard } from "../shared/section-card";
import { SectionLabel } from "../shared/section-label";
import { ExpenseData } from "../../../schemas/transactionSchemas";

interface CategorySelectorProps {
  control: Control<ExpenseData>;
  expenseCategories: any;
  categoriesLoading: boolean;
  t: (key: string) => string;
  theme: Theme;
  dimensions: any;
  errors: any;
}

export const CategorySelector = ({
  control,
  expenseCategories,
  categoriesLoading,
  t,
  theme,
  dimensions,
  errors,
}: CategorySelectorProps) => (
  <SectionCard theme={theme} dimensions={dimensions}>
    <SectionLabel icon="folder" label={t("expense.selectCategory")} theme={theme} dimensions={dimensions} />
    <Controller
      control={control}
      name="category_id"
      render={({ field: { onChange, value } }) => (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
        >
          {categoriesLoading ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                padding: 12,
              }}
            >
              <ActivityIndicator size="small" color={theme.error} />
              <Text style={{ color: theme.textTertiary }}>
                {t("expense.loading")}
              </Text>
            </View>
          ) : (
            expenseCategories?.data?.map((category: Category) => {
              const isSelected = value === category.id.toString();
              return (
                <Pressable
                  key={category.id}
                  onPress={() => onChange(category.id.toString())}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: isSelected
                      ? category.color
                      : theme.bordersecondary,
                    backgroundColor: isSelected
                      ? category.color
                      : theme.weeklycard,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  })}
                >
                  <Feather
                    name={category.icon as any}
                    size={16}
                    color={isSelected ? "#fff" : category.color}
                  />
                  <Text
                    style={{
                      fontSize: dimensions.fontSM,
                      fontWeight: "600",
                      color: isSelected ? "#fff" : theme.textSenary,
                    }}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      )}
    />
    {errors.category_id && (
      <Text
        style={{
          color: theme.error,
          fontSize: dimensions.fontXS,
          marginTop: 8,
        }}
      >
        {errors.category_id.message}
      </Text>
    )}
  </SectionCard>
);
