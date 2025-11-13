import { showErrorToast, showSuccessToast } from "@/src/constanst/toast";
import { useTheme } from "@/src/contexts/theme";
import { useResponsive } from "@/src/hooks/useRespons";
import { supabase } from "@/src/lib/supabase";
import { useChat } from "@ai-sdk/react";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { fetch as expoFetch } from "expo/fetch";
import { useEffect, useRef, useState } from "react";
<<<<<<< HEAD
import { useTranslation } from "react-i18next";
=======
>>>>>>> 2742bcc (ilk yükleme)
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserexpenseCategories } from "../../../src/lib/category";
import { transactionsApi } from "../../../src/lib/transactions";
import { generateAPIUrl } from "../../../src/utils/utils";

export default function Aichat() {
  const queryClient = useQueryClient();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { theme } = useTheme();
  const { dimensions, wp } = useResponsive();
<<<<<<< HEAD
  const { t } = useTranslation();
=======
>>>>>>> 2742bcc (ilk yükleme)

  const { messages, error, status, stop, append } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/api/chat"),
  });

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
<<<<<<< HEAD
        Alert.alert(t("aiChat.camera.permissionRequired"));
=======
        alert("Kamera izni gerekli!");
>>>>>>> 2742bcc (ilk yükleme)
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        base64: true,
        quality: 0.8,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets?.[0]?.base64) {
        const b64 = result.assets[0].base64 as string;
        const dataUrl = `data:image/jpeg;base64,${b64}`;
        await append({
          role: "user",
          content: [
<<<<<<< HEAD
            { type: "text", text: t("aiChat.message.photoSent") },
=======
            { type: "text", text: "Fiş fotoğrafı gönderildi." },
>>>>>>> 2742bcc (ilk yükleme)
            { type: "file", url: dataUrl, mediaType: "image/jpeg" },
          ],
        } as any);
      }
    } catch {
<<<<<<< HEAD
      Alert.alert(t("aiChat.camera.errorOpening"));
=======
      alert("Kamera açılırken bir hata oluştu.");
>>>>>>> 2742bcc (ilk yükleme)
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
<<<<<<< HEAD
        Alert.alert(t("aiChat.gallery.permissionRequired"));
=======
        Alert.alert("Galeri izni gerekli!");
>>>>>>> 2742bcc (ilk yükleme)
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 0.8,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets?.[0]?.base64) {
        const b64 = result.assets[0].base64 as string;
        const dataUrl = `data:image/jpeg;base64,${b64}`;
        await append({
          role: "user",
          content: [
<<<<<<< HEAD
            { type: "text", text: t("aiChat.message.photoSent") },
=======
            { type: "text", text: "Fiş fotoğrafı gönderildi." },
>>>>>>> 2742bcc (ilk yükleme)
            { type: "file", url: dataUrl, mediaType: "image/jpeg" },
          ],
        } as any);
      }
    } catch {
<<<<<<< HEAD
      Alert.alert(t("aiChat.gallery.errorOpening"));
=======
      alert("Galeri açılırken bir hata oluştu.");
>>>>>>> 2742bcc (ilk yükleme)
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages, status]);

  const parseItems = (text: string) => {
    const kalemlerIndex = text.indexOf("🧾");
    const section = kalemlerIndex >= 0 ? text.slice(kalemlerIndex) : text;
    const lines = section.split(/\n/);
    const itemLines = lines.filter((l) => /^(\s*[•✅🛍️\-])/u.test(l.trim()));
    const items: { name: string; price: number; quantity: number }[] = [];
    for (const raw of itemLines) {
      const line = raw.trim().replace(/^[•✅🛍️\-]+\s*/u, "");
      const qtyMatch = line.match(/\bx\s*(\d+(?:[\.,]\d+)?)\b/i);
      const quantity = qtyMatch
        ? Number(String(qtyMatch[1]).replace(",", "."))
        : 1;
      const priceMatch = line.match(
        /([0-9]+[\.,][0-9]{2}|[0-9]+)\s*(TL|₺)?\s*$/i
      );
      let price = 0;
      if (priceMatch?.[1]) {
        const priceStr = String(priceMatch[1]);
        if (priceStr.includes(",")) {
          price = Number(priceStr.replace(",", "."));
        } else {
          price = Number(priceStr);
        }
      }
      let name = line
        .replace(/\s*—\s*([0-9]+[\.,][0-9]{2}|[0-9]+)\s*(TL|₺)?\s*$/i, "")
        .replace(/\bx\s*\d+(?:[\.,]\d+)?\b/i, "")
        .trim()
        .replace(/[^\w\sçğıöşüÇĞIİÖŞÜ]/g, "")
        .trim();
<<<<<<< HEAD
      if (!name) name = t("aiChat.defaultItemName");
=======
      if (!name) name = "Ürün";
>>>>>>> 2742bcc (ilk yükleme)
      items.push({
        name,
        price: isFinite(price) ? price : 0,
        quantity: isFinite(quantity) ? quantity : 1,
      });
    }
    return items;
  };

  const parseAssistantText = (text: string) => {
    if (!text || typeof text !== "string") {
      return {
        total: undefined,
        title: undefined,
        date: undefined,
        time: undefined,
        suggestedCategory: undefined,
        items: [],
      };
    }

    
    const totalMatch = text.match(/(?:💰|💸|💵|💰)\s*(?:Toplam|Total|TOPLAM|TOTAL):\s*([\d.,]+)/i);
    
    const patterns = [
      /(?:💰|💸|💵)\s*(?:Toplam|Total|TOPLAM|TOTAL)[:\s]*([\d.,]+)/i,
      /(?:Toplam|Total|TOPLAM|TOTAL)[:\s]*([\d.,]+)\s*(?:TL|₺|türk lirası)/i,
      /(?:Fatura Tutarı|Tutar|Amount)[:\s]*([\d.,]+)\s*(?:TL|₺|türk lirası)/i,
      /(?:Toplam|Total)[:\s]*([\d.,]+)/i,
      /([\d.,]+)\s*(?:TL|₺|türk lirası)\s*(?:toplam|total)/i,
      /(?:TOTAL|TOPLAM)[:\s]*([\d.,]+)/i,
      /(?:Tutar|Amount)[:\s]*([\d.,]+)/i
    ];

    let total: number | undefined;
    let matchedValue: string | undefined;
    
    // Önce ana pattern'i dene
    if (totalMatch?.[1]) {
      matchedValue = totalMatch[1];
    } else {
      // Tüm pattern'leri sırayla dene
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match?.[1]) {
          matchedValue = match[1];
          break;
        }
      }
    }
    
    if (matchedValue) {
      // Türkçe sayı formatını düzelt (1.072,00 → 1072.00)
      let totalRaw = String(matchedValue);
      
      // Eğer nokta binlik ayırıcı ise (1.072,00 formatı)
      if (totalRaw.includes('.') && totalRaw.includes(',')) {
        // Noktayı kaldır, virgülü nokta yap
        totalRaw = totalRaw.replace(/\./g, '').replace(',', '.');
      } else if (totalRaw.includes(',')) {
        // Sadece virgül varsa nokta yap
        totalRaw = totalRaw.replace(',', '.');
      }
      
      total = Number(totalRaw);
      if (!isFinite(total)) total = undefined;
    }
    
    // Eğer total bulunamadıysa, items'dan hesapla (son çare)
    if (!total) {
      const items = parseItems(text);
      
      // Items'da fiyat formatı sorunlu olabilir, dikkatli hesapla
      const calculatedTotal = items.reduce((sum, item) => {
        const itemTotal = item.price * item.quantity;
        return sum + itemTotal;
      }, 0);
      
      
      // Items'dan hesaplama güvenilir değil, sadece çok küçük değerlerde kullan
      if (calculatedTotal > 0 && calculatedTotal < 100) {
        total = calculatedTotal;
      } else {
        // Total undefined kalacak, kullanıcı manuel girebilir
      }
    }
    
    let normalizedDate: string | undefined;
    const dateTokenMatch = text.match(
      /\b(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{2,4})\b/
    );
    if (dateTokenMatch?.[1] && dateTokenMatch[2] && dateTokenMatch[3]) {
      try {
        const d = String(dateTokenMatch[1]).padStart(2, "0");
        const m = String(dateTokenMatch[2]).padStart(2, "0");
        let y = String(dateTokenMatch[3]);
        if (y.length === 2) y = `20${y}`;
        normalizedDate = `${y}-${m}-${d}`;
      } catch {
        normalizedDate = undefined;
      }
    }

    const timeMatch = text.match(/\b(\d{1,2}:\d{2})\b/);
    const normalizedTime = timeMatch?.[1];

    let title: string | undefined;
    const titleMatch = text.match(/🏪\s*([^\n]+)/);
    if (titleMatch?.[1]) {
      title = titleMatch[1]
        .trim()
        .replace(/[^\w\sçğıöşüÇĞIİÖŞÜ]/g, "")
        .trim();
      if (!title) title = undefined;
    }

    let suggestedCategory: string | undefined;

    const categoryMatch1 = text.match(/🏷️\s*Kategori:\s*([^\n]+)/);
    if (categoryMatch1?.[1]) {
      suggestedCategory = categoryMatch1[1]
        .trim()
        .replace(/[^\w\sçğıöşüÇĞIİÖŞÜ]/g, "")
        .trim();
    }

    if (!suggestedCategory) {
      const categoryMatch2 = text.match(/🏷️\s*([^\n]+)/);
      if (categoryMatch2?.[1]) {
        suggestedCategory = categoryMatch2[1]
          .trim()
          .replace(/[^\w\sçğıöşüÇĞIİÖŞÜ]/g, "")
          .trim();
      }
    }

    if (!suggestedCategory) {
      const categoryNames = [
        "Market",
        "Ulaşım",
        "Faturalar",
        "Kira",
        "Eğlence",
        "Sağlık",
        "Giyim",
        "Yemek",
        "Eğitim",
        "Diğer",
      ];
      for (const name of categoryNames) {
        if (text.includes(name)) {
          suggestedCategory = name;
          break;
        }
      }
    }

    const items = parseItems(text);
    return {
      total,
      title,
      date: normalizedDate,
      time: normalizedTime,
      suggestedCategory,
      items,
    };
  };

  const handleConfirmSave = async (assistantMessageText: string) => {
    try {
      if (!assistantMessageText || typeof assistantMessageText !== "string") {
<<<<<<< HEAD
        Alert.alert(t("aiChat.alert.errorTitle"), t("aiChat.alert.invalidMessage"));
=======
        Alert.alert("Hata", "Geçersiz mesaj metni");
>>>>>>> 2742bcc (ilk yükleme)
        return;
      }

      setIsSaving(true);
      const {
        total,
        title,
        date,
        time: parsedTime,
        suggestedCategory,
        items,
      } = parseAssistantText(assistantMessageText);

      const { data: categories } = await getUserexpenseCategories();

      if (!categories || !Array.isArray(categories)) {
<<<<<<< HEAD
        Alert.alert(t("aiChat.alert.errorTitle"), t("aiChat.alert.categoriesLoadError"));
=======
        Alert.alert("Hata", "Kategoriler yüklenemedi");
>>>>>>> 2742bcc (ilk yükleme)
        return;
      }

      let selectedCategory = null;

      if (suggestedCategory) {
        selectedCategory = categories.find(
          (c: any) => c?.name?.toLowerCase() === suggestedCategory.toLowerCase()
        );

        if (!selectedCategory) {
          selectedCategory = categories.find(
            (c: any) =>
              c?.name
                ?.toLowerCase()
                .includes(suggestedCategory.toLowerCase()) ||
              suggestedCategory.toLowerCase().includes(c?.name?.toLowerCase())
          );
        }

        if (!selectedCategory) {
          const categoryMappings: { [key: string]: string[] } = {
            market: ["market", "süpermarket", "grocery"],
            yemek: ["yemek", "restoran", "cafe", "kahve"],
            ulaşım: ["ulaşım", "transport", "taksi", "otobüs"],
            sağlık: ["sağlık", "health", "eczane", "doktor"],
            giyim: ["giyim", "clothing", "kıyafet"],
            eğlence: ["eğlence", "entertainment", "sinema", "oyun"],
            eğitim: ["eğitim", "education", "okul", "kurs"],
            kira: ["kira", "rent", "ev"],
            faturalar: ["faturalar", "bills", "elektrik", "su", "internet"],
          };

          const suggestedLower = suggestedCategory.toLowerCase();
          for (const [categoryName, keywords] of Object.entries(
            categoryMappings
          )) {
            if (keywords.some((keyword) => suggestedLower.includes(keyword))) {
              selectedCategory = categories.find(
                (c: any) => c?.name?.toLowerCase() === categoryName
              );
              if (selectedCategory) break;
            }
          }
        }
      }

      if (!selectedCategory) {
        selectedCategory =
          categories.find((c: any) => c?.name === "Diğer") || categories[0];
      }

      if (!selectedCategory) {
<<<<<<< HEAD
        showErrorToast(t("aiChat.alert.errorTitle"), t("aiChat.alert.categoryNotFound"));
=======
        showErrorToast("Kategori bulunamadı");
>>>>>>> 2742bcc (ilk yükleme)
        return;
      }

      const now = new Date();
      const time = parsedTime || now.toTimeString().slice(0, 5);

      const payload: any = {
        category_id: String(selectedCategory?.id || ""),
        total_amount: isFinite(total as number) ? total : 0,
        type: "gider",
        date: date || now.toISOString().split("T")[0],
        time,
<<<<<<< HEAD
        description: title || t("aiChat.defaultDescription"),
=======
        description: title || "AI fiş analizi",
>>>>>>> 2742bcc (ilk yükleme)
      };

      const transactionData = await transactionsApi.addTransaction(payload);
      const transactionId = transactionData?.data?.id;

      if (transactionId && items && Array.isArray(items) && items.length > 0) {
        const rows = items.map((it) => ({
          transaction_id: transactionId,
<<<<<<< HEAD
          item_name: it?.name || t("aiChat.defaultItemName"),
=======
          item_name: it?.name || "Ürün",
>>>>>>> 2742bcc (ilk yükleme)
          unit_price: isFinite(it?.price) ? it.price : 0,
          quantity: isFinite(it?.quantity) ? it.quantity : 1,
        }));
        await supabase.from("expense_items").insert(rows);
      }

<<<<<<< HEAD
      showSuccessToast(t("aiChat.toast.saveSuccessTitle"), t("aiChat.toast.saveSuccessMessage"));
=======
      showSuccessToast("Kaydedildi", "Analiz edilen bilgiler başarıyla kaydedildi.");
>>>>>>> 2742bcc (ilk yükleme)
      
      // Tüm transaction ile ilgili query'leri invalidate et
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsByLastprocess"] });
      queryClient.invalidateQueries({ queryKey: ["getTransactionsByTwoWeeksAgo"] });
      queryClient.invalidateQueries({ queryKey: ["getTransactionsByYear"] });
      queryClient.invalidateQueries({ queryKey: ["getallTables"] });
      queryClient.invalidateQueries({ queryKey: ["twoweeksAgoData"] });
      queryClient.invalidateQueries({ queryKey: ["yearsincome"] });
      
      // Chart ve analytics query'leri
      queryClient.invalidateQueries({ queryKey: ["piechartData"] });
      
      
    } catch (e: any) {
<<<<<<< HEAD
      showErrorToast(
        t("aiChat.toast.saveErrorTitle"),
        e?.message || t("aiChat.toast.saveErrorMessage")
      );
=======
      showErrorToast("Hata", e?.message || "Kayıt sırasında hata oluştu");
>>>>>>> 2742bcc (ilk yükleme)
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1A3D63",
        }}
      >
        <Text style={{ color: "#EF4444", fontSize: 16, fontWeight: "600" }}>
<<<<<<< HEAD
          {t("aiChat.alert.errorTitle")}: {error?.message || t("aiChat.error.unknown")}
=======
          Hata: {error?.message || "Bilinmeyen hata"}
>>>>>>> 2742bcc (ilk yükleme)
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: theme.headerbackground,
            paddingVertical: dimensions.md,
            paddingHorizontal: dimensions.md,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: dimensions.fontTitle,
              fontWeight: "700",
              color: theme.textPrimary,
            }}
          >
<<<<<<< HEAD
            {t("aiChat.header.title")}
=======
            Fiş Analizi
>>>>>>> 2742bcc (ilk yükleme)
          </Text>
          <Text
            style={{
              fontSize: dimensions.fontSM,
              color: theme.textSecondary,
              marginTop: dimensions.xs,
            }}
          >
<<<<<<< HEAD
            {t("aiChat.header.subtitle")}
=======
            Fotoğraf çekin veya galeriden seçin
>>>>>>> 2742bcc (ilk yükleme)
          </Text>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: dimensions.md,
            paddingVertical: dimensions.md,
            flexGrow: 1,
          }}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: dimensions.md,
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  padding: dimensions.md,
                  borderRadius: dimensions.borderRadiusXL,
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <Ionicons name="camera-outline" size={72} color={theme.defaultIconColor} />
                <Text
                  style={{
                    fontSize: dimensions.fontLG*1.1,
                    color: theme.textPrimary,
                    marginTop: dimensions.md,
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
<<<<<<< HEAD
                  {t("aiChat.emptyState.title")}
=======
                  Fiş Fotoğrafı Gönderin
>>>>>>> 2742bcc (ilk yükleme)
                </Text>
                <Text
                  style={{
                    fontSize: dimensions.fontMD,
                    color: theme.textSecondary,
                    marginTop: dimensions.xs,
                    textAlign: "center",
                    lineHeight: dimensions.lg,
                  }}
                >
<<<<<<< HEAD
                  {t("aiChat.emptyState.description")}
=======
                  AI asistanınız fişinizi analiz edecek ve harcamalarınızı
                  otomatik olarak kaydedecek
>>>>>>> 2742bcc (ilk yükleme)
                </Text>
              </View>
            </View>
          ) : (
            messages?.map((m, msgIndex) => (
              <View
                key={m?.id || msgIndex}
                style={{
                  marginVertical: dimensions.xs,
                  alignSelf: m?.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      m?.role === "user"
                        ? theme.primary
                        : "rgba(255, 255, 255, 0.95)",
                    borderRadius: dimensions.borderRadiusXL,
                    padding: dimensions.md,
                    shadowColor: theme.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: dimensions.xs,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: m?.role === "user" ? theme.border : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: dimensions.fontSM,
                      color: m?.role === "user" ? theme.textPrimary : theme.textSecondary,
                      marginBottom: dimensions.xs,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
<<<<<<< HEAD
                    {m?.role === "user"
                      ? t("aiChat.message.userLabel")
                      : t("aiChat.message.assistantLabel")}
=======
                    {m?.role === "user" ? "📸 Gönderilen Fiş" : "🤖 AI Analizi"}
>>>>>>> 2742bcc (ilk yükleme)
                  </Text>

                  {typeof m.content === "string" ? (
                    <Text
                      style={{
                        fontSize: dimensions.fontMD,
                        lineHeight: dimensions.lg,
                        color: m?.role === "user" ? theme.text : theme.textSenary,
                      }}
                    >
                      {m.content}
                    </Text>
                  ) : Array.isArray(m.content) ? (
                    (m.content as any[]).map((part: any, i: number) => {
                      if (!part) return null;
                      switch (part?.type) {
                        case "text":
                          return (
                            <Text
                              key={`${m?.id}-${i}`}
                              style={{
                                fontSize: dimensions.fontMD,
                                lineHeight: dimensions.lg,
                                color:
                                  m?.role === "user" ? theme.text : theme.textSenary,
                              }}
                            >
                              {part?.text || ""}
                            </Text>
                          );
                        case "file":
                        case "image":
                          return part?.url ? (
                            <Image
                              key={`${m?.id}-${i}`}
                              source={{ uri: part.url }}
                              style={{
                                width: wp(50),
                                height: wp(50),
                                borderRadius: dimensions.borderRadiusLG,
                                marginTop: dimensions.xs,
                                borderWidth: 2,
                                borderColor: theme.border,
                              }}
                              resizeMode="cover"
                            />
                          ) : null;
                        default:
                          return null;
                      }
                    })
                  ) : null}

                  {m?.role === "assistant" &&
                    msgIndex === messages.length - 1 && (
                      <View
                        style={{
                          flexDirection: "row",
                          gap: dimensions.xs,
                          marginTop: 14,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            let text = "";
                            if (typeof m.content === "string") {
                              text = m.content;
                            } else if (Array.isArray(m.content)) {
                              text = (m.content as any[])
                                .filter((p: any) => p?.type === "text")
                                .map((p: any) => p?.text)
                                .join("\n");
                            }
                            if (text) {
                              handleConfirmSave(text);
                            }
                          }}
                          style={{
                            backgroundColor: theme.buttonprimary,
                            paddingVertical: dimensions.md,
                            paddingHorizontal: dimensions.md,
                            borderRadius: dimensions.borderRadiusLG,
                            opacity: isSaving ? 0.6 : 1,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: dimensions.xs,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: dimensions.xs },
                            shadowOpacity: 0.2,
                            shadowRadius: dimensions.xs,
                            elevation: 3,
                          }}
                          disabled={isSaving}
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={dimensions.iconMD}
                            color={theme.white}
                          />
                          <Text
                            style={{
                              color: theme.text,
                              fontWeight: "700",
                              fontSize: dimensions.fontMD,
                            }}
                          >
<<<<<<< HEAD
                            {isSaving ? t("aiChat.save.loading") : t("aiChat.save.button")}
=======
                            {isSaving ? "Kaydediliyor..." : "Kaydet"}
>>>>>>> 2742bcc (ilk yükleme)
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
              </View>
            ))
          )}

          {status === "submitted" && (
            <View
              style={{
                alignItems: "center",
                paddingVertical: dimensions.md,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: dimensions.borderRadiusXL,
                marginTop: dimensions.xs,
              }}
            >
              <ActivityIndicator size="large" color={theme.textPrimary} />
              <Text
                style={{
                  color: theme.textSecondary,
                  marginTop: dimensions.xs,
                  fontSize: dimensions.fontMD,
                  fontWeight: "500",
                }}
              >
<<<<<<< HEAD
                {t("aiChat.processing")}
=======
                Fiş analiz ediliyor...
>>>>>>> 2742bcc (ilk yükleme)
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Camera/Gallery Buttons */}
        <View
          style={{
            backgroundColor: theme.headerbackground,
            paddingHorizontal: dimensions.md,
            paddingVertical: dimensions.md,
            borderTopWidth: 2,
            borderTopColor: theme.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 6,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: dimensions.xs,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={pickImage}
              style={{
                flex: 1,
                backgroundColor: theme.primary,
                paddingVertical: dimensions.md,
                borderRadius: dimensions.borderRadiusLG,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: dimensions.xs,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: dimensions.xs,
                elevation: 3,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
              disabled={status === "submitted"}
            >
              <Ionicons name="camera" size={dimensions.iconMD} color={theme.textPrimary} />
              <Text
                style={{
                  color: theme.text,
                  fontWeight: "700",
<<<<<<< HEAD
                  fontSize: dimensions.fontSM,
                }}
              >
                {t("aiChat.button.capture")}
=======
                  fontSize: dimensions.fontMD,
                }}
              >
                Fotoğraf Çek
>>>>>>> 2742bcc (ilk yükleme)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickFromGallery}
              style={{
                flex: 1,
                backgroundColor: theme.headerbackground,
                paddingVertical: dimensions.md,
                borderRadius: dimensions.borderRadiusLG,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: dimensions.xs,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: dimensions.xs,
                elevation: 3,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
              disabled={status === "submitted"}
            >
              <Ionicons name="images" size={dimensions.iconMD} color={theme.textPrimary} />
              <Text
                style={{
                  color: theme.text,
                  fontWeight: "700",
<<<<<<< HEAD
                  fontSize: dimensions.fontSM,
                }}
              >
                {t("aiChat.button.gallery")}
=======
                  fontSize: dimensions.fontMD,
                }}
              >
                Galeriden Seç
>>>>>>> 2742bcc (ilk yükleme)
              </Text>
            </TouchableOpacity>
          </View>

          {status === "submitted" && (
            <TouchableOpacity
              onPress={stop}
              style={{
                backgroundColor: theme.error,
                paddingVertical: dimensions.md,
                borderRadius: dimensions.borderRadiusLG,
                justifyContent: "center",
                alignItems: "center",
                marginTop: dimensions.xs,
                flexDirection: "row",
                gap: dimensions.xs,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: dimensions.xs,
                elevation: 3,
              }}
            >
              <Ionicons name="stop-circle" size={dimensions.iconMD} color={theme.white} />
              <Text
                style={{
                  color: theme.text,
                  fontWeight: "700",
                  fontSize: dimensions.fontMD,
                }}
              >
<<<<<<< HEAD
                {t("aiChat.button.stop")}
=======
                Durdur
>>>>>>> 2742bcc (ilk yükleme)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
