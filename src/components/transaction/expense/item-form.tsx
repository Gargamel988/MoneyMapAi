import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { APP_CONFIG } from "../../../constants/config";
import { Theme } from "../../../contexts/theme";
import { hexToRgba } from "../../../utils/hextorgba";
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
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 14,
        fontSize: dimensions.fontMD,
        color: theme.text,
        marginBottom: dimensions.md,
        borderWidth: 1.5,
        borderColor: theme.cardBorder,
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
            borderRadius: 14,
            paddingHorizontal: 14,
            borderWidth: 1.5,
            borderColor: theme.cardBorder,
          }}
        >
          <Text
            style={{
              fontSize: dimensions.fontLG,
              fontWeight: "700",
              color: theme.error,
              marginRight: 6,
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
              color: theme.text,
              paddingVertical: 14,
              fontWeight: "600",
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
            borderRadius: 14,
            overflow: "hidden",
            borderWidth: 1.5,
            borderColor: theme.cardBorder,
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
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: hexToRgba(theme.primary, 0.1),
            }}
          >
            <Feather name="minus" size={20} color={theme.primary} />
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
              fontWeight: "700",
              color: theme.text,
              paddingVertical: 12,
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
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: hexToRgba(theme.primary, 0.1),
            }}
          >
            <Feather name="plus" size={20} color={theme.primary} />
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
            ? hexToRgba(theme.primary, 0.2)
            : theme.primary,
        borderRadius: 16,
        paddingVertical: 16,
        marginTop: dimensions.md,
        opacity: !currentItem.itemName || currentItem.price <= 0 ? 0.5 : 1,
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
