import { useResponsive } from "@/src/hooks/useRespons";
import { useTranslation } from "react-i18next";
import { Alert, FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/theme";

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
  const { dimensions } = useResponsive();
  const currencyOptions = [
    { code: "TRY", symbol: "₺", name: t("modalCurrency.currencies.TRY") },
    { code: "USD", symbol: "$", name: t("modalCurrency.currencies.USD") },
    { code: "EUR", symbol: "€", name: t("modalCurrency.currencies.EUR") },
    { code: "GBP", symbol: "£", name: t("modalCurrency.currencies.GBP") },
    { code: "JPY", symbol: "¥", name: t("modalCurrency.currencies.JPY") },
    { code: "CNY", symbol: "¥", name: t("modalCurrency.currencies.CNY") },
  ];

  const onpress = ( currency: string ) => {
Alert.alert(t("modalCurrency.alert.title"), t("modalCurrency.alert.message"), [
  { text: t("modalCurrency.alert.cancel"), style: 'cancel' },
  { text: t("modalCurrency.alert.confirm"), onPress: () => {
	mutation.mutate(currency);
    setShowCurrencyModal(false);
  } },
]);


  }
 
  return (
    <Modal
      visible={showCurrencyModal}
      onRequestClose={() => setShowCurrencyModal(false)}
      transparent={true}
      animationType="slide"
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setShowCurrencyModal(false)}
        />

        <View
          style={{
            borderTopLeftRadius: dimensions.borderRadiusXL,
            borderTopRightRadius: dimensions.borderRadiusXL,
            paddingHorizontal: dimensions.md,
            paddingBottom: dimensions.md,
            paddingTop: dimensions.xl,
            backgroundColor: theme.white,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <View style={{ marginBottom: dimensions.md, alignItems: "center" }}>
            <View
              style={{
                marginBottom: dimensions.md,
                height: 4,
                width: 48,
                borderRadius: dimensions.borderRadius,
                backgroundColor: theme.border,
              }}
            />
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: dimensions.md,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: dimensions.fontXL,
                    fontWeight: "700",
                    color: theme.inputtitle,
                  }}
                >
                  {t("modalCurrency.title")}
                </Text>
                <Text
                  style={{
                    marginTop: dimensions.xs,
                    fontSize: dimensions.fontSM,
                    color: theme.textTertiary,
                  }}
                >
                  {t("modalCurrency.current")}: {currency}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCurrencyModal(false)}
                accessibilityRole="button"
                accessibilityLabel={t("modalCurrency.close")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  marginLeft: dimensions.md,
                  height: dimensions.iconLG,
                  width: dimensions.iconLG,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: dimensions.borderRadiusLG,
                  backgroundColor: theme.inputbackground,
                }}
              >
                <Text style={{ color: theme.inputtitle }}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ maxHeight: "70%" }}>
            <FlatList
              data={currencyOptions}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = (currency ?? "") === item.code;
                return (
                  <TouchableOpacity
                    style={{
                      marginBottom: dimensions.md,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: dimensions.borderRadiusLG,
                      padding: dimensions.md,
                      backgroundColor: isSelected
                        ? theme.primary
                        : theme.inputbackground,
                    }}
                    activeOpacity={0.7}
                    onPress={() => {
                      onpress(
                        item.code as
                          | "TRY"
                          | "USD"
                          | "EUR"
                          | "GBP"
                          | "JPY"
                          | "CNY"
                      );
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          marginRight: dimensions.md,
                          height: dimensions.iconXL,
                          width: dimensions.iconXL,
                          borderRadius: dimensions.borderRadiusLG,
                          backgroundColor: isSelected
                            ? "rgba(255, 255, 255, 0.2)"
                            : theme.inputbackground,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: dimensions.fontXL,
                            fontWeight: "600",
                            color: isSelected ? "#fff" : theme.inputtitle,
                          }}
                        >
                          {item.symbol}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            marginBottom: dimensions.sm,
                            fontSize: dimensions.fontMD,
                            fontWeight: "600",
                            color: isSelected ? "#fff" : theme.inputtitle,
                          }}
                        >
                          {item.code}
                        </Text>
                        <Text
                          style={{
                            fontSize: dimensions.fontSM,
                            color: isSelected
                              ? "rgba(255, 255, 255, 0.8)"
                              : theme.textTertiary,
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
                    </View>

                    {isSelected && (
                      <View
                        style={{
                          height: dimensions.iconSM,
                          width: dimensions.iconSM,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: dimensions.borderRadiusLG,
                          backgroundColor: "#fff",
                        }}
                      >
                        <Text style={{ color: theme.primary }}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>

        
        </View>
      </View>
    </Modal>
  );
};
