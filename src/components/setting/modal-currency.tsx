import { APP_CONFIG, CurrencyCode } from "@/src/constants/config";
import { useResponsive } from "@/src/hooks/useResponsive";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useTheme } from "../../contexts/theme";

type CurrencyOption = {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
};

type ModalCurrencyProps = {
  showCurrencyModal: boolean;
  setShowCurrencyModal: (showCurrencyModal: boolean) => void;
  currency: string;
  mutation: any;
};

export const ModalCurrency = ({
  showCurrencyModal,
  setShowCurrencyModal,
  currency,
  mutation,
}: ModalCurrencyProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions, hp, wp } = useResponsive();

  const currencyOptions: CurrencyOption[] = [
    { code: "TRY", symbol: APP_CONFIG.currencies.TRY.symbol, name: t("modalCurrency.currencies.TRY"), flag: "🇹🇷" },
    { code: "USD", symbol: APP_CONFIG.currencies.USD.symbol, name: t("modalCurrency.currencies.USD"), flag: "🇺🇸" },
    { code: "EUR", symbol: APP_CONFIG.currencies.EUR.symbol, name: t("modalCurrency.currencies.EUR"), flag: "🇪🇺" },
    { code: "GBP", symbol: APP_CONFIG.currencies.GBP.symbol, name: t("modalCurrency.currencies.GBP"), flag: "🇬🇧" },
    { code: "JPY", symbol: APP_CONFIG.currencies.JPY.symbol, name: t("modalCurrency.currencies.JPY"), flag: "🇯🇵" },
    { code: "CNY", symbol: APP_CONFIG.currencies.CNY.symbol, name: t("modalCurrency.currencies.CNY"), flag: "🇨🇳" },
  ];

  const onpress = (currencyCode: CurrencyOption["code"]) => {
    if (currencyCode === currency) {
      // Already selected, just close
      setShowCurrencyModal(false);
      return;
    }

    Alert.alert(
      t("modalCurrency.alert.title"),
      t("modalCurrency.alert.message"),
      [
        { text: t("modalCurrency.alert.cancel"), style: "cancel" },
        {
          text: t("modalCurrency.alert.confirm"),
          onPress: () => {
            mutation.mutate(currencyCode);
            setShowCurrencyModal(false);
          },
        },
      ]
    );
  };

  const CurrencyItem = ({
    item,
    isSelected,
  }: {
    item: CurrencyOption;
    isSelected: boolean;
  }) => (
    <Pressable
      onPress={() =>
        onpress(item.code)
      }

      style={({ pressed }) => ({
        marginBottom: dimensions.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: dimensions.borderRadiusLG,
        padding: dimensions.md,
        backgroundColor: isSelected
          ? theme.primary
          : pressed
            ? `${theme.primary}15`
            : theme.weeklycard,
        borderWidth: isSelected ? 0 : 1,
        borderColor: isSelected ? "transparent" : theme.bordersecondary,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        {/* Flag & Symbol Container */}
        <View
          style={{
            marginRight: dimensions.md,
            width: dimensions.iconXL + 8,
            height: dimensions.iconXL + 8,
            borderRadius: dimensions.borderRadiusLG,
            backgroundColor: isSelected
              ? "rgba(255, 255, 255, 0.2)"
              : `${theme.primary}10`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: dimensions.fontXL + 4 }}>{item.flag}</Text>
        </View>

        {/* Currency Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              style={{
                fontSize: dimensions.fontMD,
                fontWeight: "700",
                color: isSelected ? "#fff" : theme.inputtitle,
                letterSpacing: 0.5,
              }}
            >
              {item.code}
            </Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 6,
                backgroundColor: isSelected
                  ? "rgba(255,255,255,0.2)"
                  : `${theme.primary}15`,
              }}
            >
              <Text
                style={{
                  fontSize: dimensions.fontSM,
                  fontWeight: "600",
                  color: isSelected ? "#fff" : theme.primary,
                }}
              >
                {item.symbol}
              </Text>
            </View>
          </View>
          <Text
            style={{
              marginTop: 4,
              fontSize: dimensions.fontSM,
              color: isSelected ? "rgba(255, 255, 255, 0.8)" : theme.textTertiary,
            }}
          >
            {item.name}
          </Text>
        </View>
      </View>

      {/* Checkmark */}
      {isSelected && (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="check" size={16} color={theme.primary} />
        </View>
      )}
    </Pressable>
  );

  return (
    <Modal
      visible={showCurrencyModal}
      onRequestClose={() => setShowCurrencyModal(false)}
      transparent={true}
      animationType="slide"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: theme.modalbackground,
        }}
      >
        {/* Backdrop tap to close */}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setShowCurrencyModal(false)}
        />

        {/* Modal Content */}
        <View
          style={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: wp(5),
            paddingBottom: hp(4),
            paddingTop: dimensions.lg,
            backgroundColor: theme.white,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
              },
              android: {
                elevation: 24,
              },
            }),
          }}
        >
          {/* Drag Handle */}
          <View style={{ alignItems: "center", marginBottom: dimensions.md }}>
            <View
              style={{
                width: 40,
                height: 5,
                borderRadius: 3,
                backgroundColor: theme.bordersecondary,
              }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: dimensions.lg,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: dimensions.fontXL + 2,
                  fontWeight: "800",
                  color: theme.inputtitle,
                  letterSpacing: -0.5,
                }}
              >
                {t("modalCurrency.title")}
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  fontSize: dimensions.fontSM,
                  color: theme.textQuinary,
                }}
              >
                {t("modalCurrency.current")}:{" "}
                <Text style={{ fontWeight: "600", color: theme.primary }}>
                  {currency}
                </Text>
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowCurrencyModal(false)}
              accessibilityRole="button"
              accessibilityLabel={t("modalCurrency.close")}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: theme.bordersecondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="x" size={18} color={theme.textQuinary} />
            </TouchableOpacity>
          </View>

          {/* Currency List */}
          <View style={{ maxHeight: hp(50) }}>
            <FlatList
              data={currencyOptions}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: dimensions.md }}
              renderItem={({ item }) => (
                <CurrencyItem
                  item={item}
                  isSelected={(currency ?? "") === item.code}
                />
              )}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
