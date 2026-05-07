import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../src/contexts/theme";
import { useDebts } from "../../../src/hooks/useDebts";
import { useResponsive } from "../../../src/hooks/useResponsive";
import { Debt, DebtType } from "../../../src/types/debtTypes";

export default function DebtsScreen() {
  const { theme } = useTheme();
  const { wp, hp, dimensions } = useResponsive();
  const { t } = useTranslation();
  const { getDebts, addDebt, updateDebt, deleteDebt, payInstallment, updateDebtStatus } = useDebts();
  const { data: debts, isLoading } = getDebts();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  // Form States
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<DebtType>("borç");
  const [description, setDescription] = useState("");
  const [isInstallment, setIsInstallment] = useState(false);
  const [totalInstallments, setTotalInstallments] = useState("1");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSaveDebt = () => {
    if (!personName || !amount) return;

    const payload = {
      person_name: personName,
      amount: parseFloat(amount),
      type,
      description,
      is_installment: isInstallment,
      total_installments: parseInt(totalInstallments) || 1,
      remaining_installments: editingDebt ? editingDebt.remaining_installments : (parseInt(totalInstallments) || 1),
      due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
      status: editingDebt ? editingDebt.status : "beklemede",
    };

    if (editingDebt) {
      updateDebt.mutate({ id: editingDebt.id, debtData: payload });
    } else {
      addDebt.mutate({ ...payload, remaining_installments: parseInt(totalInstallments) || 1 });
    }

    closeModal();
  };

  const openEditModal = (debt: Debt) => {
    setEditingDebt(debt);
    setPersonName(debt.person_name);
    setAmount(debt.amount.toString());
    setType(debt.type);
    setDescription(debt.description || "");
    setIsInstallment(debt.is_installment);
    setTotalInstallments(debt.total_installments.toString());
    setDueDate(debt.due_date ? new Date(debt.due_date) : null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingDebt(null);
    resetForm();
  };

  const resetForm = () => {
    setPersonName("");
    setAmount("");
    setDescription("");
    setIsInstallment(false);
    setTotalInstallments("1");
    setDueDate(null);
  };

  const renderDebtItem = ({ item }: { item: Debt }) => (
    <View style={{
      flexDirection: "row",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 12,
      backgroundColor: theme.cardGlass,
      borderColor: theme.cardBorder
    }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text }}>{item.person_name}</Text>
          {item.is_installment && (
            <View style={{ backgroundColor: theme.primary + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ color: theme.primary, fontSize: 10, fontWeight: '800' }}>TAKSİTLİ</Text>
            </View>
          )}
          {item.status === 'ödendi' && (
            <View style={{ backgroundColor: theme.success + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ color: theme.success, fontSize: 10, fontWeight: '800' }}>ÖDENDİ</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 12, marginTop: 4, color: theme.textSecondary }}>{item.description}</Text>

        <View style={{ marginTop: 8, gap: 4 }}>
          {item.due_date && (
            <Text style={{ fontSize: 11, fontWeight: '600', color: theme.warning }}>
              <MaterialCommunityIcons name="calendar-clock" size={12} /> Vade: {new Date(item.due_date).toLocaleDateString()}
            </Text>
          )}
          {item.is_installment && item.status !== 'ödendi' && (
            <Text style={{ fontSize: 11, fontWeight: '600', color: theme.primary }}>
              <MaterialCommunityIcons name="repeat" size={12} /> Kalan: {item.remaining_installments}/{item.total_installments} Taksit
            </Text>
          )}
        </View>
      </View>

      <View style={{ alignItems: "flex-end", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 18, fontWeight: "800", color: item.type === "borç" ? theme.error : theme.success }}>
          {item.type === "borç" ? "-" : "+"}{item.amount}₺
        </Text>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
          {item.status !== 'ödendi' && (
            <TouchableOpacity
              onPress={() => item.is_installment ? payInstallment.mutate(item.id) : updateDebtStatus.mutate({ id: item.id, status: 'ödendi' })}
              style={{
                backgroundColor: item.is_installment ? theme.primary : theme.success,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4
              }}
            >
              <MaterialCommunityIcons name="check-bold" size={14} color="white" />
              <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>
                {item.is_installment ? "Taksit Öde" : "Ödedim"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => openEditModal(item)}
            style={{ backgroundColor: theme.cardGlass, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: theme.cardBorder }}
          >
            <MaterialCommunityIcons name="pencil-outline" size={18} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteDebt.mutate(item.id)}
            style={{ backgroundColor: theme.error + '15', padding: 8, borderRadius: 8 }}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: theme.cardGlass, padding: 8, borderRadius: 12 }}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "800", color: theme.text, letterSpacing: -0.5 }}>Borç Takibi</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: theme.primary, padding: 8, borderRadius: 12 }}>
          <MaterialCommunityIcons name="plus" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={debts}
        renderItem={renderDebtItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
          ) : (
            <View style={{ alignItems: "center", marginTop: 100 }}>
              <MaterialCommunityIcons name="handshake-outline" size={80} color={theme.cardBorder} />
              <Text style={{ color: theme.textSecondary, fontSize: 16, marginTop: 16, fontWeight: '500' }}>Henüz kayıtlı borç yok.</Text>
            </View>
          )
        }
      />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 }}>
          <View style={{
            backgroundColor: theme.background,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            maxHeight: hp(85)
          }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text }}>
                  {editingDebt ? "Borcu Düzenle" : "Yeni Borç Ekle"}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <MaterialCommunityIcons name="close" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 16 }}>
                <View>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8, fontWeight: '600' }}>KİŞİ / KURUM</Text>
                  <TextInput
                    style={{
                      backgroundColor: theme.cardGlass,
                      borderRadius: 12,
                      padding: 14,
                      color: theme.text,
                      borderWidth: 1,
                      borderColor: theme.cardBorder
                    }}
                    placeholder="Örn: Ahmet Yılmaz"
                    placeholderTextColor={theme.textTertiary}
                    value={personName}
                    onChangeText={setPersonName}
                  />
                </View>

                <View>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8, fontWeight: '600' }}>TOPLAM MİKTAR</Text>
                  <TextInput
                    style={{
                      backgroundColor: theme.cardGlass,
                      borderRadius: 12,
                      padding: 14,
                      color: theme.text,
                      borderWidth: 1,
                      borderColor: theme.cardBorder
                    }}
                    placeholder="0.00"
                    placeholderTextColor={theme.textTertiary}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1, padding: 14, borderRadius: 12, alignItems: "center",
                      backgroundColor: type === "borç" ? theme.error : theme.cardGlass,
                      borderWidth: 1, borderColor: type === "borç" ? theme.error : theme.cardBorder
                    }}
                    onPress={() => setType("borç")}
                  >
                    <Text style={{ color: type === "borç" ? "white" : theme.text, fontWeight: '700' }}>BORÇ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1, padding: 14, borderRadius: 12, alignItems: "center",
                      backgroundColor: type === "alacak" ? theme.success : theme.cardGlass,
                      borderWidth: 1, borderColor: type === "alacak" ? theme.success : theme.cardBorder
                    }}
                    onPress={() => setType("alacak")}
                  >
                    <Text style={{ color: type === "alacak" ? "white" : theme.text, fontWeight: '700' }}>ALACAK</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
                  <View>
                    <Text style={{ color: theme.text, fontWeight: '700' }}>Taksitli İşlem</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 11 }}>Ödemeyi taksitlere bölerek takip et</Text>
                  </View>
                  <Switch
                    value={isInstallment}
                    onValueChange={setIsInstallment}
                    trackColor={{ false: theme.cardBorder, true: theme.primary }}
                    thumbColor="white"
                  />
                </View>

                {isInstallment && (
                  <View>
                    <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8, fontWeight: '600' }}>TAKSİT SAYISI</Text>
                    <TextInput
                      style={{
                        backgroundColor: theme.cardGlass,
                        borderRadius: 12,
                        padding: 14,
                        color: theme.text,
                        borderWidth: 1,
                        borderColor: theme.cardBorder
                      }}
                      placeholder="12"
                      placeholderTextColor={theme.textTertiary}
                      keyboardType="numeric"
                      value={totalInstallments}
                      onChangeText={setTotalInstallments}
                    />
                  </View>
                )}

                <View>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8, fontWeight: '600' }}>VADE / ÖDEME TARİHİ</Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.cardGlass,
                      borderRadius: 12,
                      padding: 14,
                      borderWidth: 1,
                      borderColor: theme.cardBorder,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onPress={() => setDatePickerVisibility(true)}
                  >
                    <Text style={{ color: dueDate ? theme.text : theme.textTertiary, fontWeight: dueDate ? '600' : '400' }}>
                      {dueDate ? dueDate.toLocaleDateString() : "Tarih Seçin"}
                    </Text>
                    <MaterialCommunityIcons name="calendar" size={20} color={theme.textTertiary} />
                  </TouchableOpacity>
                </View>

                <View>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8, fontWeight: '600' }}>AÇIKLAMA</Text>
                  <TextInput
                    style={{
                      backgroundColor: theme.cardGlass,
                      borderRadius: 12,
                      padding: 14,
                      color: theme.text,
                      borderWidth: 1,
                      borderColor: theme.cardBorder,
                      minHeight: 80,
                      textAlignVertical: 'top'
                    }}
                    placeholder="Not ekleyin..."
                    placeholderTextColor={theme.textTertiary}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 32 }}>
                <TouchableOpacity
                  style={{ padding: 16, borderRadius: 12 }}
                  onPress={closeModal}
                >
                  <Text style={{ color: theme.error, fontWeight: '700' }}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.primary,
                    paddingHorizontal: 32,
                    paddingVertical: 16,
                    borderRadius: 16,
                    shadowColor: theme.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5
                  }}
                  onPress={handleSaveDebt}
                >
                  <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>
                    {editingDebt ? "Güncelle" : "Kaydet"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setDueDate(date);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </SafeAreaView>
  );
}
