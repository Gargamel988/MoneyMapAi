import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalCategory from "../categories/modal-category";
import { getUserexpenseCategories } from "../../lib/category";
import { getCurrency } from "../../lib/profil";
import { supabase } from "../../lib/supabase";
import { transactionsApi } from "../../lib/transactions";
import { ExpenseData, expenseSchema } from "../../schemas/transactionSchemas";
import { formatDate, formatTime } from "../../utils/date";
import { formatTotal } from "../../utils/total";
import { showErrorToast, showSuccessToast } from "../../constanst/toast";
import { useTheme } from "../../contexts/theme";
import { hp, useResponsive, wp } from "../../hooks/useRespons";
import { Category } from "../../types/transactıonstype";

export const ExpenseEntry: React.FC = () => {
  const { theme } = useTheme();
  const { dimensions } = useResponsive();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [list, setList] = useState<
    { itemName: string; price: number; quantity: number }[]
  >([]);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<{
    itemName: string;
    price: number;
    priceString: string;
    quantity: number;
  }>({ itemName: "", price: 0, priceString: "", quantity: 1 });




  const [ expense_categoriesQuery, currencyQuery] =useQueries({
    queries: [
      {
        queryKey: ["expense_categories"],
        queryFn: getUserexpenseCategories,
      },
      {
        queryKey: ["currency"],
        queryFn: getCurrency,
      },
    ],
  });


  const { control, handleSubmit, reset, formState, setValue } = useForm<ExpenseData>({
    resolver: zodResolver(expenseSchema) ,
    defaultValues: {
      category_id: "",
      urun: [],
      date: new Date(),
      time: new Date().toLocaleTimeString(),
      description: "",
    },
  });

  

  // Expense kategorilerini fetch et
  const currency = currencyQuery?.data?.currency || "TRY"; 
  const expenseCategories = expense_categoriesQuery?.data;
  const categoriesLoading = expense_categoriesQuery?.isLoading;

  // React Query Mutation - VERİTABANI ŞEMASINA UYARLANMIŞ
  const addExpenseMutation = useMutation({
    mutationFn: async (formData: ExpenseData) => {
      const totalAmount = list.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // 1. Ana transaction kaydını oluştur
      const transactionData = await transactionsApi.addTransaction({
        category_id: formData.category_id,
        total_amount: totalAmount,
        date: formData.date.toISOString().split("T")[0],
        time: formData.time.toString(),
        type: "gider",
        description: formData.description,
      });

      // Transaction data kontrolü
      if (!transactionData || !transactionData.data || !transactionData.data.id) {
        throw new Error('Transaction oluşturulamadı');
      }

      // list değişkenini expense_items olarak kullan
      const expenseItems = list.map((item: { itemName: string; price: number; quantity: number }) => ({
        transaction_id: transactionData.data.id,
        item_name: item.itemName,
        unit_price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("expense_items")
        .insert(expenseItems);

      if (itemsError) throw itemsError;

      return transactionData.data;
    },
    onSuccess: () => {
      const totalAmount = list.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    
      // Query invalidation'ı try-catch ile sar
      try {
        queryClient.invalidateQueries({ queryKey: ["transactionsByLastprocess"] });
        queryClient.invalidateQueries({ queryKey: ["getTransactionsByTwoWeeksAgo"] });
        queryClient.invalidateQueries({ queryKey: ["getTransactionsByYear"] });
        queryClient.invalidateQueries({ queryKey: ["piechartData"] });
        queryClient.invalidateQueries({ queryKey: ["getallTables"] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } catch (error) {
        console.error('Query invalidation error:', error);
      }

      showSuccessToast(
        "Başarılı! 🎉",
        `${formatTotal(totalAmount, currency)} gider başarıyla eklendi`
      );

      setList([]);
      reset({
        category_id: "",
        urun: [],
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        description: "",
      });
      setCurrentItem({ itemName: "", price: 0, priceString: "", quantity: 1 });
    },
    onError: (error: Error) => {
      showErrorToast("Hata", error.message);
    },
  });

  const addItem = () => {
    if (
      !currentItem.itemName ||
      currentItem.price <= 0 ||
      currentItem.quantity < 1
    ) {
      return;
    }

    const newItem = {
      itemName: currentItem.itemName,
      price: Number(currentItem.price),
      quantity: Number(currentItem.quantity),
    };

    const updatedList = [...list, newItem];
    setList(updatedList);
    setValue('urun', updatedList); // Form'u güncelle
    setCurrentItem({ itemName: "", price: 0, priceString: "", quantity: 1 });
  };

  const removeItem = (index: number) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    setValue('urun', updatedList); // Form'u güncelle
  };

  const onSubmit = (data: ExpenseData) => {
    addExpenseMutation.mutate(data);
  };

  const totalAmount = list.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
 
  if (showAddForm) {
    return (
      <ModalCategory
        visible
        onClose={() => setShowAddForm(false)}
        edit={false}
      />
    );
  }
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.expensebackground,
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        width: "100%",
        maxWidth: 600,
        alignSelf: "center",
        borderRadius: dimensions.borderRadiusXL,
        padding: dimensions.md,
      }}
    >
      <View
        style={{
          marginBottom: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: wp(3),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: wp(2),
          }}
        >
          <View
            style={{
              borderRadius: 12,
              padding: wp(3),
              backgroundColor: theme.primary + "20",
            }}
          >
            <Feather name="trending-down" size={24} color={theme.error} />
          </View>
          <Text
            style={{
              fontWeight: "bold",
              color: theme.white,
              fontSize: dimensions.fontXL,
            }}
          >
            Gider Ekle
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 99,
            padding: dimensions.sm,
            backgroundColor: theme.white,
          }}
          onPress={() => {
            setShowAddForm(true);
          }}
        >
          <Feather name="plus" size={24} color={theme.textTertiary} />
          <Text
            style={{ color: theme.textTertiary, fontSize: dimensions.fontXS }}
          >
            kategori ekle
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <View style={{ gap: dimensions.md }}>
          {/* Kategori Kartı */}
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 16,
              padding: dimensions.md,
            }}
          >
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: theme.textSecondary,
                  fontSize: dimensions.fontMD,
                }}
              >
                Kategori Seçin
              </Text>
              <Controller
                control={control}
                name="category_id"
                render={({ field: { onChange, value } }) => (
                  <View
                    style={{
                      borderColor: theme.border,
                      backgroundColor: theme.input,
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{
                        paddingHorizontal: 8,
                      }}
                    >
                      {categoriesLoading ? (
                        <Text
                          style={{
                            color: theme.textSecondary,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                          }}
                        >
                          Yükleniyor...
                        </Text>
                      ) : (
                        expenseCategories?.data?.map((category: Category) => (
                          <Pressable
                            key={category.id}
                            onPress={() => onChange(category.id)}
                            className="mr-3 flex-row items-center gap-2 rounded-lg px-4 py-3"
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 8,
                              backgroundColor:
                                value === category.id.toString()
                                  ? category.color
                                  : theme.input,
                              borderWidth: 1,
                              borderColor: category.color,
                              marginRight: 12,
                              borderRadius: 12,
                              paddingHorizontal: 16,
                              paddingVertical: 12,
                            }}
                          >
                            <Feather
                              name={category.icon as any}
                              size={16}
                              color={
                                value === category.id.toString()
                                  ? theme.white
                                  : category.color
                              }
                            />
                            <Text
                              style={{
                                color:
                                  value === category.id.toString()
                                    ? theme.white
                                    : theme.textTertiary,
                              }}
                            >
                              {category.name}
                            </Text>
                          </Pressable>
                        ))
                      )}
                    </ScrollView>
                  </View>
                )}
              />
              {formState.errors.category_id && (
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.error,
                  }}
                >
                  {formState.errors.category_id.message}
                </Text>
              )}
            </View>
          </View>

          {/* Ürün Bilgileri Kartı */}
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.inputtitle,
              borderRadius: 16,
              padding: dimensions.md,
            }}
          >
            <View style={{ gap: 16 }}>
              <View style={{ gap: 8 }}>
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontWeight: "bold",
                    fontSize: dimensions.fontMD,
                  }}
                >
                  Ürün Adı
                </Text>
                <TextInput
                  placeholder="Ürün adını girin"
                  placeholderTextColor={theme.inputplaceholder}
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.input,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    color: theme.textSenary,
                    fontSize: dimensions.fontMD,
                    borderRadius: 12,
                  }}
                  value={currentItem.itemName}
                  onChangeText={(t) =>
                    setCurrentItem((prev) => ({ ...prev, itemName: t }))
                  }
                  editable={!addExpenseMutation.isPending}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 16 }}>
                {/* Fiyat */}
                <View style={{ flex: 1, gap: 8 }}>
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontWeight: "bold",
                      fontSize: dimensions.fontMD,
                    }}
                  >
                    Fiyat
                  </Text>

                  <TextInput
                    keyboardType="numeric"
                    value={currentItem.priceString }
                    onChangeText={(t) => {
                      setCurrentItem((prev) => ({
                        ...prev,
                        priceString: t,
                        price: parseFloat(t) || 0
                      }));
                    }}
                    placeholder="0.00"
                    placeholderTextColor={theme.inputplaceholder}
                    style={{
                      borderColor: theme.border,
                      backgroundColor: theme.input,
                      paddingVertical: 8,
                      paddingLeft: 12,
                      paddingRight: 12,
                      color: theme.textSenary,
                      fontSize: dimensions.fontMD,
                      borderRadius: 12,
                    }}
                    editable={!addExpenseMutation.isPending}
                  />
                </View>

                {/* Adet */}
                <View style={{ flex: 1, gap: 8 }}>
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontWeight: "bold",
                      fontSize: dimensions.fontMD,
                    }}
                  >
                    Adet
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        setCurrentItem((prev) => ({
                          ...prev,
                          quantity: Math.max(1, (prev.quantity || 1) - 1),
                        }));
                      }}
                      disabled={addExpenseMutation.isPending}
                      style={{
                        width: wp(10),
                        height: hp(5),
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: theme.border,
                        backgroundColor: theme.input,
                        borderRadius: dimensions.borderRadius,
                      }}
                    >
                      <Feather
                        name="minus"
                        size={dimensions.iconSM}
                        color={theme.textSenary}
                      />
                    </TouchableOpacity>
                    <TextInput
                      keyboardType="number-pad"
                      value={String(currentItem.quantity || 1)}
                      onChangeText={(t) => {
                        const numValue = Math.max(1, parseInt(t || "1", 10));
                        setCurrentItem((prev) => ({
                          ...prev,
                          quantity: numValue,
                        }));
                      }}
                      style={{
                        width: wp(10),
                        height: hp(5),
                        textAlign: "center",
                        borderColor: theme.border,
                        backgroundColor: theme.input,
                        paddingVertical: 8,
                        color: theme.textSenary,
                        fontSize: dimensions.fontMD,
                        borderRadius: dimensions.borderRadius,
                      }}
                      editable={!addExpenseMutation.isPending}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentItem((prev) => ({
                          ...prev,
                          quantity: (prev.quantity || 1) + 1,
                        }));
                      }}
                      activeOpacity={1}
                      disabled={addExpenseMutation.isPending}
                      style={{
                        width: wp(10),
                        height: hp(5),
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: theme.border,
                        backgroundColor: theme.input,
                        borderRadius: dimensions.borderRadius,
                      }}
                    >
                      <Feather
                        name="plus"
                        size={dimensions.iconSM}
                        color={theme.textSenary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Ürün Ekle Butonu */}
          <TouchableOpacity
            onPress={addItem}
            activeOpacity={1}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderColor: theme.border,
              backgroundColor: theme.buttonprimary,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              opacity: 1,
            }}
          >
            <Feather name="plus" size={dimensions.iconSM} color={theme.white} />
            <Text
              style={{
                marginLeft: 8,
                color: theme.white,
                fontSize: dimensions.fontMD,
              }}
            >
              Ürün Ekle
            </Text>
          </TouchableOpacity>

          {/* Ürün Listesi Kartı */}
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.inputtitle,
              borderRadius: dimensions.borderRadiusXL,
              padding: dimensions.md,
            }}
          >
            <Text
              style={{
                marginBottom: 8,
                fontWeight: "bold",
                color: theme.textSecondary,
                fontSize: dimensions.fontMD,
              }}
            >
              Ürün Listesi
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                maxHeight: hp(20),
                backgroundColor: theme.input,
                borderRadius: dimensions.borderRadius,
              }}
              contentContainerStyle={{
                paddingHorizontal: wp(4),
                paddingVertical: hp(1.5),
              }}
              nestedScrollEnabled={true}
            >
              {list.length === 0 ? (
                <Text
                  style={{
                    color: theme.textSecondary,
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  Henüz ürün eklenmedi
                </Text>
              ) : (
                list.map((item, index) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "semibold",
                          color: theme.textSenary,
                        }}
                      >
                        {item.itemName}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "thin",
                          color: theme.textSenary,
                          fontSize: dimensions.fontSM,
                        }}
                      >
                        {formatTotal(item.price, currency)} × {item.quantity} ={" "}
                        {formatTotal(item.price * item.quantity, currency)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeItem(index)}
                      disabled={addExpenseMutation.isPending}
                      style={{ padding: 8 }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Feather
                        name="x"
                        size={dimensions.iconSM}
                        color={theme.textSenary}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          {/* Toplam Tutar Kartı */}
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.inputtitle,
              borderRadius: dimensions.borderRadiusXL,
              padding: dimensions.md,
            }}
          >
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  color: theme.textSecondary,
                  fontWeight: "semibold",
                  fontSize: dimensions.fontMD,
                }}
              >
                Sepet Toplamı
              </Text>
              <View
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.input,
                  borderRadius: dimensions.borderRadiusLG,
                  padding: dimensions.md,
                }}
              >
                <Text
                  style={{
                    color: theme.textSenary,
                    fontWeight: "bold",
                    fontSize: dimensions.fontXL,
                  }}
                >
                  {formatTotal(totalAmount, currency)}
                </Text>
              </View>
            </View>
          </View>

          {/* Açıklama Kartı */}
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.inputtitle,
              borderRadius: dimensions.borderRadiusXL,
              padding: dimensions.md,
            }}
          >
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange } }) => (
                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontWeight: "semibold",
                      fontSize: dimensions.fontMD,
                    }}
                  >
                    Açıklama{" "}
                    <Text
                      style={{
                        fontSize: dimensions.fontSM,
                        color: theme.textSecondary,
                      }}
                    >
                      {"(İsteğe bağlı)"}
                    </Text>
                  </Text>
                  <TextInput
                    placeholder="Açıklama girin"
                    placeholderTextColor={theme.inputplaceholder}
                    style={{
                      borderRadius: dimensions.borderRadiusLG,
                      borderWidth: 1,
                      borderColor: theme.border,
                      backgroundColor: theme.input,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      color: theme.textSenary,
                      fontSize: dimensions.fontMD,
                    }}
                    value={value || ""}
                    onChangeText={onChange}
                    editable={!addExpenseMutation.isPending}
                  />
                </View>
              )}
            />
          </View>

          {/* Tarih Kartı */}
          <View
            style={{
              padding: dimensions.md,
              borderRadius: dimensions.borderRadiusXL,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.inputtitle,
            }}
          >
            <Text
              style={{
                fontWeight: "semibold",
                fontSize: dimensions.fontMD,
                color: theme.textSecondary,
              }}
            >
              Tarih ve Saat
            </Text>
            <View
              style={{
                marginTop: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <>
                    <TouchableOpacity
                      onPress={() => setIsDateOpen(true)}
                      disabled={addExpenseMutation.isPending}
                      activeOpacity={1}
                      style={{
                        width: "50%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: theme.border,
                        backgroundColor: theme.input,
                        borderRadius: dimensions.borderRadiusLG,
                        padding: 12,
                      }}
                    >
                      <Feather
                        name="calendar"
                        size={dimensions.iconSM}
                        color={theme.textSenary}
                      />
                      <Text
                        style={{
                          color: theme.textSenary,
                          marginLeft: 8,
                          fontSize: dimensions.fontSM,
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
              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <>
                    <TouchableOpacity
                      onPress={() => setIsTimeOpen(true)}
                      disabled={addExpenseMutation.isPending}
                      activeOpacity={1}
                      style={{
                        width: "50%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        borderColor: theme.border,
                        backgroundColor: theme.input,
                        borderRadius: dimensions.borderRadiusLG,
                        padding: 12,
                      }}
                    >
                      <Feather
                        name="clock"
                        size={dimensions.iconSM}
                        color={theme.textSenary}
                      />
                      <Text
                        style={{
                          color: theme.textSenary,
                          marginLeft: 8,
                          fontSize: dimensions.fontSM,
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
            <View
              style={{
                marginTop: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Feather
                name="info"
                size={dimensions.iconSM}
                color={theme.textQuaternary}
              />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: dimensions.fontXS,
                  color: theme.textQuaternary,
                }}
              >
                tarih ve saati doldurmaya özen gösteriniz işlemleriniz tarih ve
                saat bazında filtrelenebilir
              </Text>
            </View>
          </View>

          {/* Submit Butonu */}
          <TouchableOpacity
            onPress={handleSubmit((data) => onSubmit(data as ExpenseData))}
            disabled={
              addExpenseMutation.isPending ||
              list.length === 0 ||
              categoriesLoading
            }
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              backgroundColor: theme.buttonprimary,
              borderRadius: dimensions.borderRadiusLG,
              paddingVertical: 16,
            }}
          >
            <Text
              style={{
                fontSize: dimensions.fontXL,
                fontWeight: "semibold",
                color: theme.white,
              }}
            >
              {addExpenseMutation.isPending ? "Kaydediliyor..." : "Gider Ekle"}
            </Text>
          </TouchableOpacity>

          {/* Hata mesajları */}
          {Object.keys(formState.errors).length > 0 && (
            <View
              style={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.error,
                backgroundColor: theme.error + "20",
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontSize: dimensions.fontMD,
                  color: theme.error,
                  fontWeight: 'bold',
                  marginBottom: 8,
                }}
              >
                Eksik Alanlar:
              </Text>
              {Object.entries(formState.errors).map(([field, error]) => (
                <Text
                  key={field}
                  style={{
                    fontSize: dimensions.fontSM,
                    color: theme.error,
                    marginBottom: 4,
                  }}
                >
                  • {field}: {error?.message || 'Bu alan zorunludur'}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
