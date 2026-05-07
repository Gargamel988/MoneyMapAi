import React from "react";
import { Control, Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { APP_CONFIG } from "../../../constants/config";
import { Theme } from "../../../contexts/theme";
import { IncomeFormData } from "../../../schemas/transactionSchemas";
import { SectionCard } from "../shared/section-card";
import { SectionLabel } from "../shared/section-label";

interface AmountInputProps {
  control: Control<IncomeFormData>;
  currency: string;
  displayValue: string;
  setDisplayValue: (value: string) => void;
  isPending: boolean;
  t: (key: string) => string;
  theme: Theme;
  dimensions: any;
  hp: (percentage: number) => number;
  errors: any;
}

export const AmountInput = ({
  control,
  currency,
  displayValue,
  setDisplayValue,
  isPending,
  t,
  theme,
  dimensions,
  hp,
  errors,
}: AmountInputProps) => (
  <SectionCard theme={theme} dimensions={dimensions}>
    <SectionLabel icon="dollar-sign" label={t("income.amount")} theme={theme} dimensions={dimensions} success />
    <Controller
      control={control}
      name="total_amount"
      render={({ field: { onChange } }) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.inputbackground,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: dimensions.fontXL + 4,
              fontWeight: "700",
              color: theme.success,
              marginRight: 8,
            }}
          >
            {APP_CONFIG.currencies[currency as keyof typeof APP_CONFIG.currencies]?.symbol || currency}
          </Text>
          <TextInput
            keyboardType="decimal-pad"
            onChangeText={(text) => {
              const digitsOnly = text.replace(/\D/g, "");
              const formattedValue = digitsOnly
                ? Number(digitsOnly).toLocaleString("tr-TR")
                : "";
              setDisplayValue(formattedValue);
              const numValue = digitsOnly ? Number(digitsOnly) : 0;
              onChange(numValue);
            }}
            value={displayValue}
            placeholder="0"
            placeholderTextColor={theme.textTertiary}
            editable={!isPending}
            style={{
              flex: 1,
              fontSize: dimensions.fontXL + 4,
              fontWeight: "700",
              color: theme.textSenary,

              paddingVertical: hp(2),
            }}
          />
        </View>
      )}
    />
    {errors.total_amount && (
      <Text
        style={{
          color: theme.error,
          fontSize: dimensions.fontXS,
          marginTop: 8,
        }}
      >
        {errors.total_amount.message}
      </Text>
    )}
  </SectionCard>
);
