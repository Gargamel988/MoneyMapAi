import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useResponsive";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

interface SelectProps {
  placeholder?: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  value: string;
  disabled?: boolean;
  onAlertMessage?: (value: string) => void;
}

export const Select = ({
  placeholder = "Seçim yapın",
  options,
  onValueChange,
  value,
  onAlertMessage,
  disabled
}: SelectProps) => {
  const { theme } = useTheme();
  const { hp, dimensions, moderateScale, wp } = useResponsive();
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || null);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  const handleSelect = (item: { label: string; value: string }) => {
    setSelectedValue(item.value);
    setVisible(false);
    if (onValueChange) {
      onValueChange(item.value);
    }
  };



  return (
    <View>
      {/* Trigger Button */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.headerbackground,
          borderWidth: 1.5,
          borderColor: theme.bordersecondary,
          borderRadius: 14,
          paddingHorizontal: dimensions.md,
          paddingVertical: dimensions.sm,
          height: moderateScale(46),
          width: wp(42),
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 2,
        }}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: dimensions.fontMD,
            fontWeight: "600",
            color: theme.text,
          }}
          numberOfLines={1}
        >
          {selectedLabel}
        </Text>
        <View style={{
          backgroundColor: `${theme.primary}15`,
          padding: 4,
          borderRadius: 8
        }}>
          <Feather
            name={visible ? "chevron-up" : "chevron-down"}
            size={moderateScale(16)}
            color={theme.primary}
          />
        </View>
      </TouchableOpacity>

      {/* Modal Bottom Sheet */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={{
            maxHeight: hp(70),
            backgroundColor: theme.headerbackground,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            paddingBottom: dimensions.xl,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 20,
          }}>
            {/* Drag Handle */}
            <View
              style={{
                alignItems: "center",
                paddingVertical: dimensions.md,
              }}
            >
              <View
                style={{
                  width: moderateScale(48),
                  height: moderateScale(6),
                  backgroundColor: theme.bordersecondary,
                  borderRadius: moderateScale(3),
                }}
              />
            </View>

            {/* Header if needed, or just padding */}
            <Text style={{
              fontSize: dimensions.fontLG,
              fontWeight: "700",
              color: theme.text,
              paddingHorizontal: wp(6),
              paddingBottom: dimensions.md,
              letterSpacing: 0.3
            }}>
              {placeholder}
            </Text>

            {/* Items List */}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              contentContainerStyle={{
                paddingHorizontal: wp(4),
                gap: 8,
                paddingBottom: dimensions.md
              }}
              renderItem={({ item }) => {
                const isSelected = selectedValue && disabled ? false : selectedValue === item.value;

                return (
                  <TouchableOpacity
                    style={[
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: wp(5),
                        paddingVertical: dimensions.md,
                        borderRadius: 16,
                        backgroundColor: theme.background,
                        borderWidth: 1.5,
                        borderColor: isSelected ? theme.primary : "transparent",
                      },
                      isSelected && {
                        backgroundColor: `${theme.primary}10`,
                      },
                    ]}
                    onPress={() => {
                      handleSelect(item);
                      if (onAlertMessage) {
                        onAlertMessage(item.value);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        {
                          fontSize: dimensions.fontMD,
                          color: isSelected ? theme.primary : theme.textSecondary,
                          flex: 1,
                          fontWeight: "500",
                        },
                        isSelected && {
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <View style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: theme.primary,
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Feather
                          name="check"
                          size={moderateScale(14)}
                          color="#FFFFFF"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              style={{ maxHeight: hp(50) }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
