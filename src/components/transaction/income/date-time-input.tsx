import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Theme } from "../../../contexts/theme";
import { IncomeFormData } from "../../../schemas/transactionSchemas";
import { formatDate, formatTime } from "../../../utils/date";
import { SectionCard } from "../shared/section-card";
import { SectionLabel } from "../shared/section-label";

interface DateTimeInputProps {
  control: Control<IncomeFormData>;
  isDateOpen: boolean;
  setIsDateOpen: (open: boolean) => void;
  isTimeOpen: boolean;
  setIsTimeOpen: (open: boolean) => void;
  isPending: boolean;
  t: (key: string) => string;
  theme: Theme;
  dimensions: any;
}

export const DateTimeInput = ({
  control,
  isDateOpen,
  setIsDateOpen,
  isTimeOpen,
  setIsTimeOpen,
  isPending,
  t,
  theme,
  dimensions,
}: DateTimeInputProps) => (
  <SectionCard theme={theme} dimensions={dimensions}>
    <SectionLabel icon="calendar" label={t("income.dateTime")} theme={theme} dimensions={dimensions} success />
    <View style={{ flexDirection: "row", gap: 12 }}>
      {/* Date Picker */}
      <Controller
        control={control}
        name="date"
        render={({ field: { value, onChange } }) => (
          <>
            <TouchableOpacity
              onPress={() => setIsDateOpen(true)}
              disabled={isPending}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 16,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: theme.inputbackground,
                borderRadius: 12,
                paddingVertical: 14,
              }}
            >
              <Feather
                name="calendar"
                size={18}
                color={theme.textTertiary}
              />
              <Text
                style={{
                  fontSize: dimensions.fontMD,
                  fontWeight: "500",
                  color: theme.textSenary,
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

      {/* Time Picker */}
      <Controller
        control={control}
        name="date"
        render={({ field: { value, onChange } }) => (
          <>
            <TouchableOpacity
              onPress={() => setIsTimeOpen(true)}
              disabled={isPending}
              activeOpacity={0.7}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: theme.inputbackground,
                borderRadius: 12,
                paddingVertical: 14,
              }}
            >
              <Feather name="clock" size={18} color={theme.textTertiary} />
              <Text
                style={{
                  fontSize: dimensions.fontMD,
                  fontWeight: "500",
                  color: theme.textSenary,
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

    {/* Info text */}
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 12,
        paddingHorizontal: 4,
      }}
    >
      <Feather name="info" size={12} color={theme.textTertiary} />
      <Text
        style={{
          fontSize: dimensions.fontXS,
          color: theme.textTertiary,
        }}
      >
        {t("income.dateTimeInfo")}
      </Text>
    </View>
  </SectionCard>
);
