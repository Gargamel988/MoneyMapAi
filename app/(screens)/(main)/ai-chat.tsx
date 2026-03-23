import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { fetch as expoFetch } from "expo/fetch";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { QUERY_KEYS } from "../../../src/constants/queryKeys";
import { showErrorToast, showSuccessToast } from "../../../src/constants/toast";
import { useTheme } from "../../../src/contexts/theme";
import { useResponsive } from "../../../src/hooks/useResponsive";

import {
  AdEventType,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "@/src/lib/adComponents";
import { supabase } from "../../../src/lib/supabase";

import { formatTotal } from "@/src/utils/total";
import { useIsFocused } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ReceiptOverlay } from "../../../src/components/camera/receipt-overlay";
import { getUserExpenseCategories } from "../../../src/lib/category";
import { transactionsApi } from "../../../src/lib/transactions";
import { objectScheme } from "../../../src/schemas/objectScheme";
import { generateAPIUrl } from "../../../src/utils/utils";

const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : (process.env.EXPO_PUBLIC_INTERSTITIAL_AD_UNIT_ID || "ca-app-pub-1444133443338193/4724740534");
const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : (process.env.EXPO_PUBLIC_REWARDED_AD_UNIT_ID || "ca-app-pub-1444133443338193/7630672720");

const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  keywords: ["finance", "savings", "money"],
});

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
  keywords: ["finance", "savings", "money"],
});

export default function AiChatScreen() {
  const queryClient = useQueryClient();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const { theme } = useTheme();
  const { dimensions, wp } = useResponsive();
  const isFocused = useIsFocused();
  const { t, i18n } = useTranslation();
  const currentLanguage = (i18n.language || 'tr').split('-')[0];

  const apiUrl = generateAPIUrl("/api/chat");

  const { object, error, submit, clear, stop, isLoading } = useObject({
    api: apiUrl,
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    schema: objectScheme,
  });
  const status = isLoading ? "submitted" : "idle";
  const wasLoadingRef = useRef(false);


  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      if (!object && selectedImage) {
        setAnalysisMessage(t("aiChat.notReceipt"));
      } else {
        setAnalysisMessage(null);
      }
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading, object, selectedImage, t]);


  useEffect(() => {
    if (!isFocused) {
      clear();
      setSelectedImage(null);
      setAnalysisMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log("Interstitial ad loaded");
    });

    interstitial.load();

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log("Rewarded ad loaded");
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward: any) => {
        console.log("User earned reward: ", reward);
      },
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const startAnalysis = (payload: any) => {
    if (rewarded.loaded) {
      rewarded.show().then(() => {
        submit(payload);
        rewarded.load(); // Reload for next time
      });
    } else {
      // If ad not loaded, allow analysis anyway but try to load for next time
      submit(payload);
      rewarded.load();
    }
  };

  const handleStop = () => {
    if (typeof stop === "function") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      stop();
      setAnalysisMessage(t("aiChat.stop.message"));
    }

  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("aiChat.camera.permissionRequired"));
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        base64: true,
        quality: 0.5,
        aspect: [4, 3],
        exif: false,
      });
      if (!result.canceled && result.assets?.[0]?.base64) {
        const b64 = result.assets[0].base64 as string;
        const dataUrl = `data:image/jpeg;base64,${b64}`;
        setAnalysisMessage(null);
        clear();
        setSelectedImage(dataUrl);
        startAnalysis({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: t("aiChat.message.photoSent") },
                { type: "file", url: dataUrl, mediaType: "image/jpeg" },
              ],
            },
          ],
          language: currentLanguage,
        } as any);
      }
    } catch {
      Alert.alert(t("aiChat.camera.errorOpening"));
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("aiChat.gallery.permissionRequired"));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 0.5,
        aspect: [4, 3],
        exif: false,
      });
      if (!result.canceled && result.assets?.[0]?.base64) {
        const b64 = result.assets[0].base64 as string;
        const dataUrl = `data:image/jpeg;base64,${b64}`;
        setAnalysisMessage(null);
        clear();
        setSelectedImage(dataUrl);
        startAnalysis({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: t("aiChat.message.photoSent") },
                { type: "file", url: dataUrl, mediaType: "image/jpeg" },
              ],
            },
          ],
          language: currentLanguage,
        } as any);
      }
    } catch {
      Alert.alert(t("aiChat.gallery.errorOpening"));
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(timeout);
  }, [object]);

  const handleConfirmSave = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      if (!object) {
        Alert.alert(t("aiChat.alert.errorTitle"), t("aiChat.alert.invalidMessage"));
        return;
      }

      setIsSaving(true);

      const { data: categories } = await getUserExpenseCategories();

      if (!categories || !Array.isArray(categories)) {
        Alert.alert(t("aiChat.alert.errorTitle"), t("aiChat.alert.categoriesLoadError"));
        return;
      }

      // Find matching category
      let selectedCategory = null;

      if (object.category) {
        selectedCategory = categories.find(
          (c: any) => c?.name?.toLowerCase() === object.category?.toLowerCase()
        );

        if (!selectedCategory) {
          selectedCategory = categories.find(
            (c: any) =>
              c?.name?.toLowerCase().includes(object.category?.toLowerCase() || "") ||
              object.category?.toLowerCase().includes(c?.name?.toLowerCase())
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

          const categoryLower = object.category.toLowerCase();
          for (const [categoryName, keywords] of Object.entries(categoryMappings)) {
            if (keywords.some((keyword) => categoryLower.includes(keyword))) {
              selectedCategory = categories.find(
                (c: any) => c?.name?.toLowerCase() === categoryName
              );
              if (selectedCategory) break;
            }
          }
        }
      }

      if (!selectedCategory) {
        selectedCategory = categories.find((c: any) => c?.name === t("categories.other")) || categories[0];
      }

      if (!selectedCategory) {
        showErrorToast(t("aiChat.alert.errorTitle"), t("aiChat.alert.categoryNotFound"));
        return;
      }

      const now = new Date();
      const time = object.time || now.toTimeString().slice(0, 5);

      // Normalize date to YYYY-MM-DD to avoid DB errors
      const normalizeDate = (value?: string) => {
        if (!value) return null;
        // Accept dd.MM.yyyy or dd/MM/yyyy
        const match = value.match(/^(\d{2})[./-](\d{2})[./-](\d{4})$/);
        if (match) {
          const [, dd, mm, yyyy] = match;
          return `${yyyy}-${mm}-${dd}`;
        }
        // Already ISO-like
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
        return null;
      };

      const parsedDate = normalizeDate(object.date);
      const date = parsedDate || now.toISOString().split("T")[0];

      const payload: any = {
        category_id: String(selectedCategory?.id || ""),
        total_amount: object.total || 0,
        type: "gider",
        date,
        time,
        description: object.description || object.title || t("aiChat.defaultDescription"),
      };

      const transactionData = await transactionsApi.addTransaction(payload);
      const transactionId = transactionData?.data?.id;

      if (transactionId && object.products && Array.isArray(object.products) && object.products.length > 0) {
        const rows = object.products.map((it) => ({
          transaction_id: transactionId,
          item_name: it?.itemName || t("aiChat.defaultItemName"),
          unit_price: it?.price || 0,
          quantity: it?.quantity || 1,
        }));
        await supabase.from("expense_items").insert(rows);
      }

      showSuccessToast(t("aiChat.toast.saveSuccessTitle"), t("aiChat.toast.saveSuccessMessage"));

      // Show interstitial ad if loaded
      if (interstitial.loaded) {
        interstitial.show();
      }

      // Invalidate all transaction queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all });
    } catch (e: any) {
      showErrorToast(
        t("aiChat.toast.saveErrorTitle"),
        e?.message || t("aiChat.toast.saveErrorMessage")
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.headerbackground,
        }}
      >
        <Text style={{ color: theme.error, fontSize: 16, fontWeight: "600" }}>
          {t("aiChat.alert.errorTitle")}: {error?.message || t("aiChat.error.unknown")}
        </Text>
      </View>
    );
  }

  const displayObject = object && (
    <View
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderRadius: dimensions.borderRadiusXL,
        padding: dimensions.lg,
        marginVertical: dimensions.sm,
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: dimensions.sm,
        elevation: 4,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.04)",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: dimensions.xs, marginBottom: dimensions.xs }}>
        <Ionicons name="sparkles-outline" size={dimensions.iconMD} color={theme.buttonprimary} />
        <Text
          style={{
            fontWeight: "700",
            fontSize: dimensions.fontSM,
            color: theme.textSecondary,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {t("aiChat.message.assistantLabel")}
        </Text>
      </View>

      {object.title && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: dimensions.xs, marginBottom: dimensions.xs }}>
          <Ionicons name="storefront-outline" size={dimensions.iconMD} color={theme.textSenary} />
          <Text style={{ fontSize: dimensions.fontLG, fontWeight: "700", color: theme.textSenary }}>
            {object.title}
          </Text>
        </View>
      )}

      {object.category && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: dimensions.xs, marginBottom: dimensions.xs }}>
          <Ionicons name="pricetag-outline" size={dimensions.iconSM} color={theme.textSenary} />
          <Text style={{ fontSize: dimensions.fontMD, color: theme.textSenary }}>
            {t("aiChat.label.category")}: {object.category}
          </Text>
        </View>
      )}

      {object.date && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: dimensions.xs, marginBottom: dimensions.xs }}>
          <Ionicons name="calendar-outline" size={dimensions.iconSM} color={theme.textSenary} />
          <Text style={{ fontSize: dimensions.fontMD, color: theme.textSenary }}>
            {t("aiChat.label.date")}: {object.date} {object.time && `• ${object.time}`}
          </Text>
        </View>
      )}

      {object.products && object.products.length > 0 && (
        <View style={{ marginTop: dimensions.xs }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: dimensions.xs, marginBottom: dimensions.xs }}>
            <Ionicons name="list-outline" size={dimensions.iconSM} color={theme.textSenary} />
            <Text style={{ fontSize: dimensions.fontMD, fontWeight: "600", color: theme.textSenary }}>
              {t("aiChat.label.items")}:
            </Text>
          </View>
          {object.products.map((item, idx) => (
            <Text key={idx} style={{ fontSize: dimensions.fontSM, color: theme.textSenary, marginLeft: wp(2) }}>
              • {item?.itemName} - {item?.quantity}x {formatTotal(item?.price || 0)}
            </Text>
          ))}
        </View>
      )}

      {object.total !== undefined && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: dimensions.xs, marginTop: dimensions.xs }}>
          <Ionicons name="cash-outline" size={dimensions.iconMD} color={theme.textSenary} />
          <Text style={{ fontSize: dimensions.fontLG, fontWeight: "700", color: theme.textSenary }}>
            {t("aiChat.label.total")}: {object.total.toFixed(2)} {t("common.currencySymbol")}
          </Text>
        </View>
      )}

      <View style={{ flexDirection: "row", gap: dimensions.xs, marginTop: dimensions.md }}>
        <TouchableOpacity
          onPress={handleConfirmSave}
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
          <Ionicons name="checkmark-circle" size={dimensions.iconMD} color={theme.white} />
          <Text
            style={{
              color: theme.text,
              fontWeight: "700",
              fontSize: dimensions.fontMD,
            }}
          >
            {isSaving ? t("aiChat.save.loading") : t("aiChat.save.button")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
            {t("aiChat.header.title")}
          </Text>
          <Text
            style={{
              fontSize: dimensions.fontSM,
              color: theme.textSecondary,
              marginTop: dimensions.xs,
            }}
          >
            {t("aiChat.header.subtitle")}
          </Text>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, backgroundColor: theme.headerbackground }}
          contentContainerStyle={{
            paddingHorizontal: dimensions.md,
            paddingVertical: dimensions.md,
            flexGrow: 1,
          }}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {selectedImage && (
            <View
              style={{
                marginBottom: dimensions.md,
                alignItems: "center",
              }}
            >
              <ReceiptOverlay
                imageUri={selectedImage}
                products={object?.products as any}
                width={wp(80)}
                height={wp(80) * 0.75}
              />
              <Text
                style={{
                  marginTop: dimensions.xs,
                  color: theme.textSecondary,
                  fontSize: dimensions.fontSM,
                }}
              >
                {t("aiChat.selectedImage")}
              </Text>
            </View>
          )}

          {analysisMessage && (
            <View
              style={{
                marginBottom: dimensions.md,
                padding: dimensions.md,
                borderRadius: dimensions.borderRadiusLG,
                backgroundColor: "rgba(255, 59, 48, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(255, 59, 48, 0.25)",
                flexDirection: "row",
                alignItems: "center",
                gap: dimensions.xs,
              }}
            >
              <Ionicons name="alert-circle-outline" size={dimensions.iconMD} color={theme.error} />
              <Text style={{ color: theme.error, fontSize: dimensions.fontSM, flex: 1 }}>
                {analysisMessage}
              </Text>
            </View>
          )}

          {!object && !selectedImage ? (
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
                    fontSize: dimensions.fontLG * 1.1,
                    color: theme.textPrimary,
                    marginTop: dimensions.md,
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {t("aiChat.emptyState.title")}
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
                  {t("aiChat.emptyState.description")}
                </Text>
              </View>
            </View>
          ) : (
            displayObject
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
                {t("aiChat.processing")}
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
                  fontSize: dimensions.fontSM,
                }}
              >
                {t("aiChat.button.capture")}
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
                  fontSize: dimensions.fontSM,
                }}
              >
                {t("aiChat.button.gallery")}
              </Text>
            </TouchableOpacity>
          </View>

          {status === "submitted" && (
            <TouchableOpacity
              onPress={handleStop}
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
                {t("aiChat.button.stop")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
