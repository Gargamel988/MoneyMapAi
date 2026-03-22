import React from "react";
import { Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { APP_CONFIG } from "../../../constants/config";
import { Theme } from "../../../contexts/theme";
import { SectionCard } from "../shared/section-card";
import { SectionLabel } from "../shared/section-label";

interface ItemFormProps {
  currentItem: {
    itemName: string;
    price: number;
    priceString: string;
    quantity: number;
  };
  setCurrentItem: React.Dispatch<React.SetStateAction<any>>;
  addItem: () => void;
  currency: string;
  isPending: boolean;
  t: (key: string) => string;
  theme: Theme;
  dimensions: any;
}

export const ItemForm = ({
  currentItem,
  setCurrentItem,
  addItem,
  currency,
  isPending,
  t,
  theme,
  dimensions,
}: ItemFormProps) => (
  <SectionCard theme={theme} dimensions={dimensions}>
    <SectionLabel icon="package" label={t("expense.productName")} theme={theme} dimensions={dimensions} />

    {/* Product Name */}
    <TextInput
      placeholder={t("expense.productNamePlaceholder")}
      placeholderTextColor={theme.textTertiary}
      style={{
        backgroundColor: theme.inputbackground,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: dimensions.fontMD,
        color: theme.textSenary,
        marginBottom: dimensions.sm,
      }}
      value={currentItem.itemName}
      onChangeText={(text) =>
        setCurrentItem((prev: any) => ({ ...prev, itemName: text }))
      }
      editable={!isPending}
    />

    {/* Price & Quantity Row */}
    <View style={{ flexDirection: "row", gap: 12 }}>
      {/* Price */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: dimensions.fontSM,
            fontWeight: "600",
            color: theme.textTertiary,
            marginBottom: 6,
          }}
        >
          {t("expense.price")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.inputbackground,
            borderRadius: 12,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              fontSize: dimensions.fontLG,
              fontWeight: "600",
              color: theme.error,
              marginRight: 4,
            }}
          >
            {APP_CONFIG.currencies[currency as keyof typeof APP_CONFIG.currencies]?.symbol || currency}
          </Text>
          <TextInput
            keyboardType="numeric"
            value={currentItem.priceString}
            onChangeText={(text) => {
              setCurrentItem((prev: any) => ({
                ...prev,
                priceString: text,
                price: parseFloat(text) || 0,
              }));
            }}
            placeholder="0.00"
            placeholderTextColor={theme.textTertiary}
            style={{
              flex: 1,
              fontSize: dimensions.fontMD,
              color: theme.textSenary,
              paddingVertical: 12,
            }}
            editable={!isPending}
          />
        </View>
      </View>

      {/* Quantity */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: dimensions.fontSM,
            fontWeight: "600",
            color: theme.textTertiary,
            marginBottom: 6,
          }}
        >
          {t("expense.quantity")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.inputbackground,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setCurrentItem((prev: any) => ({
                ...prev,
                quantity: Math.max(1, (prev.quantity || 1) - 1),
              }));
            }}
            disabled={isPending}
            activeOpacity={0.7}
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.bordersecondary,
            }}
          >
            <Feather name="minus" size={18} color={theme.textSenary} />
          </TouchableOpacity>

          <TextInput
            keyboardType="number-pad"
            value={String(currentItem.quantity || 1)}
            onChangeText={(text) => {
              const numValue = Math.max(1, parseInt(text || "1", 10));
              setCurrentItem((prev: any) => ({
                ...prev,
                quantity: numValue,
              }));
            }}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: dimensions.fontLG,
              fontWeight: "600",
              color: theme.textSenary,
              paddingVertical: 10,
            }}
            editable={!isPending}
          />

          <TouchableOpacity
            onPress={() => {
              setCurrentItem((prev: any) => ({
                ...prev,
                quantity: (prev.quantity || 1) + 1,
              }));
            }}
            disabled={isPending}
            activeOpacity={0.7}
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.bordersecondary,
            }}
          >
            <Feather name="plus" size={18} color={theme.textSenary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>

    {/* Add Product Button */}
    <Pressable
      onPress={addItem}
      disabled={!currentItem.itemName || currentItem.price <= 0}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor:
          !currentItem.itemName || currentItem.price <= 0
            ? theme.bordersecondary
            : theme.primary,
        borderRadius: 12,
        paddingVertical: 12,
        marginTop: dimensions.md,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Feather
        name="plus-circle"
        size={18}
        color={
          !currentItem.itemName || currentItem.price <= 0
            ? theme.textTertiary
            : "#fff"
        }
      />
      <Text
        style={{
          fontSize: dimensions.fontMD,
          fontWeight: "600",
          color:
            !currentItem.itemName || currentItem.price <= 0
              ? theme.textTertiary
              : "#fff",
        }}
      >
        {t("expense.addProduct")}
      </Text>
    </Pressable>
  </SectionCard>
);
