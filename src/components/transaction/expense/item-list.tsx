import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Theme } from "../../../contexts/theme";
import { formatTotal } from "../../../utils/total";
import { SectionCard } from "../shared/section-card";
import { SectionLabel } from "../shared/section-label";

interface ItemListProps {
  list: { itemName: string; price: number; quantity: number }[];
  removeItem: (index: number) => void;
  totalAmount: number;
  currency: string;
  isPending: boolean;
  t: (key: string) => string;
  theme: Theme;
  dimensions: any;
  hp: (percentage: number) => number;
}

export const ItemList = ({
  list,
  removeItem,
  totalAmount,
  currency,
  isPending,
  t,
  theme,
  dimensions,
  hp,
}: ItemListProps) => (
  <SectionCard theme={theme} dimensions={dimensions}>
    <SectionLabel icon="shopping-bag" label={t("expense.productList")} theme={theme} dimensions={dimensions} />

    {list.length === 0 ? (
      <View
        style={{
          alignItems: "center",
          paddingVertical: hp(3),
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.inputbackground,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Feather name="inbox" size={24} color={theme.textTertiary} />
        </View>
        <Text
          style={{
            fontSize: dimensions.fontSM,
            color: theme.textTertiary,
          }}
        >
          {t("expense.noProducts")}
        </Text>
      </View>
    ) : (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: hp(20) }}
        nestedScrollEnabled={true}
      >
        {list.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.inputbackground,
              borderRadius: 12,
              padding: 12,
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: dimensions.fontMD,
                  fontWeight: "600",
                  color: theme.textSenary,
                }}
              >
                {item.itemName}
              </Text>
              <Text
                style={{
                  fontSize: dimensions.fontSM,
                  color: theme.textTertiary,
                  marginTop: 2,
                }}
              >
                {formatTotal(item.price, currency)} × {item.quantity}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text
                style={{
                  fontSize: dimensions.fontMD,
                  fontWeight: "700",
                  color: theme.error,
                }}
              >
                {formatTotal(item.price * item.quantity, currency)}
              </Text>
              <TouchableOpacity
                onPress={() => removeItem(index)}
                disabled={isPending}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: `${theme.error}15`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="trash-2" size={14} color={theme.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    )}

    {/* Total Amount */}
    {list.length > 0 && (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: `${theme.error}10`,
          borderRadius: 12,
          padding: 14,
          marginTop: 8,
        }}
      >
        <Text
          style={{
            fontSize: dimensions.fontMD,
            fontWeight: "600",
            color: theme.textSenary,
          }}
        >
          {t("expense.cartTotal")}
        </Text>
        <Text
          style={{
            fontSize: dimensions.fontXL,
            fontWeight: "700",
            color: theme.error,
          }}
        >
          {formatTotal(totalAmount, currency)}
        </Text>
      </View>
    )}
  </SectionCard>
);
