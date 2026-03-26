import { useResponsive } from "@/src/hooks/useResponsive";
import { ExpenseItem, Transaction } from "@/src/types/transactionTypes";
import { formatTotal } from "@/src/utils/total";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/theme";
type TransactionDetailProps = {
  transaction?: Transaction | null;
  onClose?: () => void;
};
export default function TransactionDetail({
  transaction,
  onClose,
}: TransactionDetailProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions } = useResponsive();
  if (!transaction) {
    return null;
  }

  const handleClose = () => {
    if (onClose) onClose();
  };


  const rawName = transaction.categories?.name || "";
  const categoryName = rawName.includes("categories.default")
    ? t(rawName as any)
    : rawName || t("topFiveExpenses.unknownCategory");
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.modalbackground,
        }}
      >
        <View
          style={{
            backgroundColor: theme.white,
            borderRadius: 20,
            width: "90%",
            shadowColor: theme.border,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          {/* Başlık */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: dimensions.md,
              borderBottomWidth: 1,
              borderBottomColor: theme.bordersecondary,
            }}
          >
            <Text
              style={{
                fontSize: dimensions.fontLG,
                fontWeight: "bold",
                color: theme.textSenary,
              }}
            >
              {t("transactionDetail.title")}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Feather name="x" size={24} color={theme.buttonsecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 500 }}>
            {/* Kategori Bilgisi */}
            <View style={{ padding: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#f0f0f0",
                    borderRadius: 99,
                    marginRight: dimensions.sm,
                    padding: dimensions.md - 6,
                  }}
                >
                  <Feather
                    name={transaction.categories?.icon as any}
                    size={dimensions.fontXL + 6}
                    color={transaction.categories?.color as string}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: dimensions.fontLG, fontWeight: "600", color: theme.textSenary }}
                  >
                    {categoryName}
                  </Text>
                  <Text style={{ fontSize: dimensions.fontSM, color: theme.textQuinary, marginTop: dimensions.xs }}>
                    {transaction.description || t("transactionDetail.noDescription")}
                  </Text>
                </View>
              </View>

              {/* Gelir/Gider ve Toplam Fiyat */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: theme.processcardbackground,
                  padding: dimensions.md,
                  borderRadius: dimensions.md,
                  marginBottom: dimensions.md,
                }}
              >
                <View>
                  <Text
                    style={{ fontSize: dimensions.fontSM, color: theme.textQuinary, marginBottom: dimensions.xs }}
                  >
                    {t("transactionDetail.type")}
                  </Text>
                  <View
                    style={{
                      backgroundColor:
                        transaction.type === "gelir" ? "#4CAF50" : "#f44336",
                      paddingHorizontal: dimensions.md - 5,
                      paddingVertical: dimensions.xs + 2,
                      borderRadius: dimensions.md,
                    }}
                  >
                    <Text
                      style={{ color: theme.text, fontSize: dimensions.fontSM, fontWeight: "600" }}
                    >
                      {transaction.type === "gelir" ? t("transactionDetail.income") : t("transactionDetail.expense")}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{ fontSize: dimensions.fontSM, color: theme.textQuinary, marginBottom: dimensions.xs }}
                  >
                    {t("transactionDetail.totalAmount")}
                  </Text>
                  <Text
                    style={{
                      fontSize: dimensions.fontXXL,
                      fontWeight: "600",
                      color:
                        transaction.type === "gelir" ? theme.success : theme.error,
                    }}
                  >
                    {transaction.type === "gider" ? "-" : "+"}{" "}
                    {formatTotal(transaction.total_amount)}
                  </Text>
                </View>
              </View>

              {/* İşlem Kalemleri */}
              <View>
                <Text
                  style={{
                    fontSize: dimensions.fontLG,
                    fontWeight: "600",
                    color: theme.textSenary,
                    marginBottom: dimensions.md,
                  }}
                >
                  {t("transactionDetail.items")}
                </Text>

                {(transaction.expense_items || []).map(
                  (item: ExpenseItem, index: number) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: dimensions.md,
                        paddingHorizontal: dimensions.md,
                        backgroundColor: index % 2 === 0 ? theme.processcardbackground : theme.white,
                        borderRadius: dimensions.md,
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
                          {item.item_name}
                        </Text>
                        <Text
                          style={{ fontSize: dimensions.fontSM, color: theme.textQuinary, marginTop: dimensions.xs }}
                        >
                          {Number(item.quantity || 1)} {t("transactionDetail.quantity")} ×{" "}
                          {formatTotal(item.unit_price)}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: dimensions.fontLG,
                          fontWeight: "600",
                          color: theme.textSenary,
                        }}
                      >
                        {formatTotal(item.total_price)}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
