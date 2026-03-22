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
      {/* Trigger */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
		  justifyContent: "space-between",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: dimensions.borderRadius,
          paddingHorizontal: dimensions.md,
          paddingVertical: dimensions.sm,
		  height: moderateScale(40),
		  width: wp(40),
        }}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: dimensions.fontMD,
            color: theme.input,
          }}
        >
          {selectedLabel}
        </Text>
        <Feather
          name={visible ? "chevron-up" : "chevron-down"}
          size={moderateScale(20)}
          color={theme.text}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: theme.modalbackground,
            justifyContent: "flex-end",
          }}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={{ maxHeight: hp(60) }}>
            <View
              style={{
                backgroundColor: theme.inputbackground,
                borderTopLeftRadius: dimensions.borderRadiusXL,
                borderTopRightRadius: dimensions.borderRadiusXL,
                paddingBottom: dimensions.lg,
              }}
            >
              {/* Drag Indicator */}
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: dimensions.sm,
                }}
              >
                <View
                  style={{
                    width: moderateScale(40),
                    height: moderateScale(4),
                    backgroundColor: theme.bordersecondary,
                    borderRadius: moderateScale(2),
                  }}
                />
              </View>

              {/* Items List */}
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => {
                  const isSelected = selectedValue === item.value;
                  return (
                    <TouchableOpacity
                      style={[
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingHorizontal: dimensions.md,
                          paddingVertical: dimensions.md,
                          borderBottomWidth: 1,
                          borderBottomColor:
                            theme.bordersecondary,
                        },
                        isSelected && {
                          backgroundColor:
                            theme.primary
                              ? `${theme.primary}15`
                              : theme.cluebackground,
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
                            color: isSelected
                              ? theme.primary
                              : theme.input,
                            flex: 1,
                          },
                          isSelected && {
                            fontWeight: "600",
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {isSelected && (
                        <Feather
                          name="check"
                          size={moderateScale(18)}
                          color={theme.primary || theme.success}
                          style={{ marginLeft: dimensions.sm }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
                style={{ maxHeight: hp(50) }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
