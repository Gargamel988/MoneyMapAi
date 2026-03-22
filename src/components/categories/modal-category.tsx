import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ColorSelectionModal } from "../../components/categories/colorpalette";
import { showWarningToast } from "../../constants/toast";
import { useTheme } from "../../contexts/theme";
import { useCategories } from "../../hooks/useCategories";
import { hp, useResponsive, wp } from "../../hooks/useResponsive";
import {
  CategoryFormData,
  categorySchema,
} from "../../schemas/categorySchemas";
import { Category } from "../../types/transactionTypes";

type ModalCategoryProps = {
  visible: boolean;
  onClose: () => void;
  edit: boolean;
  categoryData?: any;
};

export default function ModalCategory({
  visible,
  onClose,
  edit,
  categoryData,
}: ModalCategoryProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { dimensions, isTablet } = useResponsive();
  const [searchIcon, setSearchIcon] = useState("");

  const { control, handleSubmit, reset, formState, watch } =
    useForm<CategoryFormData>({
      resolver: zodResolver(categorySchema),
      defaultValues: {
        name: "",
        type: "gelir",
        icon: "",
        color: "",
      },
    });

  const [modalVisible, setModalVisible] = useState(false);
  const [iconModalVisible, setIconModalVisible] = useState(false);

  const { addCategoryMutation, updateCategoryMutation } = useCategories();

  const selectedColor = watch("color");
  const selectedIcon = watch("icon");

  useEffect(() => {
    if (visible) {
      if (edit && categoryData) {
        reset({
          name: categoryData.name || "",
          type: categoryData.type || "gelir",
          icon: categoryData.icon || "",
          color: categoryData.color || "",
        });
      } else {
        reset({
          name: "",
          type: "gelir",
          icon: "",
          color: "",
        });
      }
    }
  }, [visible, edit, categoryData, reset]);

  const categoryIcons = [
    "home",
    "shopping-cart",
    "coffee",
    "book",
    "heart",
    "star",
    "music",
    "camera",
    "gift",
    "phone",
    "mail",
    "users",
    "briefcase",
    "credit-card",
    "dollar-sign",
    "trending-up",
    "trending-down",
    "pie-chart",
    "bar-chart",
    "shopping-bag",
    "truck",
    "map-pin",
    "clock",
    "calendar",
    "umbrella",
    "sun",
    "moon",
    "cloud",
    "zap",
    "battery",
    "wifi",
    "bluetooth",
    "headphones",
    "monitor",
    "smartphone",
    "tablet",
    "tv",
    "film",
    "image",
    "video",
    "mic",
    "speaker",
    "radio",
    "tool",
    "scissors",
    "pen-tool",
    "edit",
    "trash-2",
    "archive",
    "folder",
    "file",
    "save",
    "download",
    "upload",
    "share",
    "link",
    "external-link",
    "bookmark",
    "tag",
  ] as const;

  const normalizeText = (text: string) =>
    (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ş/g, "s")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ç/g, "c")
      .replace(/ö/g, "o")
      .replace(/ü/g, "u")
      .replace(/â/g, "a")
      .trim();

  const iconKeywords: Record<string, string[]> = {
    home: ["home", "ev", "house"],
    "shopping-cart": ["shopping cart", "alışveriş", "market"],
    coffee: ["coffee", "kahve", "caf"],
    book: ["book", "kitap"],
    heart: ["heart", "kalp", "favori"],
    star: ["star", "yıldız"],
    music: ["music", "müzik", "şarkı"],
    camera: ["camera", "kamera", "foto"],
    gift: ["gift", "hediye"],
    phone: ["phone", "telefon", "arama"],
    mail: ["mail", "posta", "email"],
    users: ["users", "kullanıcı", "insan"],
    briefcase: ["briefcase", "iş", "çanta"],
    "credit-card": ["credit", "kart", "kredi"],
    "dollar-sign": ["dollar", "para", "usd"],
    "trending-up": ["trend", "artış", "gelir"],
    "trending-down": ["trend", "düşüş", "gider"],
    "pie-chart": ["chart", "grafik", "pasta"],
    "bar-chart": ["chart", "grafik", "bar"],
    "shopping-bag": ["bag", "alışveriş", "poşet"],
    truck: ["truck", "kamyon", "kargo"],
    "map-pin": ["map", "adres", "konum"],
    clock: ["clock", "saat", "time"],
    calendar: ["calendar", "takvim"],
    umbrella: ["umbrella", "şemsiye"],
    sun: ["sun", "güneş"],
    moon: ["moon", "ay"],
    cloud: ["cloud", "bulut"],
    zap: ["zap", "şimşek"],
    battery: ["battery", "pil", "enerji"],
    wifi: ["wifi", "internet"],
    bluetooth: ["bluetooth"],
    headphones: ["headphones", "kulaklık"],
    monitor: ["monitor", "ekran"],
    smartphone: ["smartphone", "telefon"],
    tablet: ["tablet"],
    tv: ["tv", "televizyon"],
    film: ["film", "sinema"],
    image: ["image", "resim", "foto"],
    video: ["video"],
    mic: ["mic", "mikrofon"],
    speaker: ["speaker", "hoparlör"],
    radio: ["radio", "radyo"],
    tool: ["tool", "alet"],
    scissors: ["scissors", "makas"],
    "pen-tool": ["pen", "kalem", "pen-tool", "kalem-kırıcı"],
    edit: ["edit", "düzenle"],
    "trash-2": ["trash", "çöp", "sil"],
    archive: ["archive", "arşiv"],
    folder: ["folder", "klasör"],
    file: ["file", "dosya"],
    save: ["save", "kaydet"],
    download: ["download", "indir"],
    upload: ["upload", "yükle"],
    share: ["share", "paylaş"],
    link: ["link", "bağlantı"],
    "external-link": ["dış bağlantı", "external link"],
    bookmark: ["bookmark", "yer imi"],
    tag: ["tag", "etiket"],
  };

  const normalizedSearchQuery = normalizeText(searchIcon);
  const filteredIcons = categoryIcons.filter((icon) => {
    if (!normalizedSearchQuery) return true;
    const keywords = iconKeywords[icon] || [icon];
    return keywords.some((keyword) =>
      normalizeText(keyword).includes(normalizedSearchQuery)
    );
  });

  const onSubmit = (data: CategoryFormData) => {
    if (edit === true) {
      const categoryId = categoryData?.id;

      if (!categoryId) {
        showWarningToast(
          t("modalCategory.error.title"),
          t("modalCategory.error.noId")
        );
        return;
      }

      updateCategoryMutation.mutate({
        id: categoryId,
        updates: data as Partial<Category>,
      });
      onClose();
    } else {
      addCategoryMutation.mutate(data as Category);
      onClose();
    }
  };

  const IconItem: React.FC<{
    item: string;
    onChange: (val: string) => void;
  }> = ({ item, onChange }) => (
    <TouchableOpacity
      onPress={() => {
        onChange(item);
        setIconModalVisible(false);
      }}
      activeOpacity={0.8}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: wp(16),
        height: hp(8),
        margin: dimensions.sm / 2,
        borderRadius: dimensions.borderRadiusLG,
        borderWidth: 1,
        borderColor: selectedIcon === item ? theme.primary : theme.border,
        backgroundColor: selectedIcon === item ? theme.primary : theme.input,
      }}
    >
      <Feather
        name={item as any}
        size={dimensions.iconMD}
        color={selectedIcon === item ? "#fff" : theme.inputtitle}
      />
    </TouchableOpacity>
  );
  IconItem.displayName = "IconItem";

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[...theme.appbackgroundgradient] as any}
        start={{ x: 0.85, y: 0.85 }}
        end={{ x: 0.15, y: 0.15 }}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flexDirection: "column",
            padding: 32,
            borderRadius: dimensions.borderRadiusXL,
            paddingTop: isTablet ? dimensions.xl : 64,
          }}
        >
          <View
            style={{
              borderRadius: dimensions.borderRadiusXL,
              paddingHorizontal: dimensions.md,
              paddingVertical: dimensions.md,
              paddingTop: dimensions.xl,
              backgroundColor: theme.white,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: dimensions.lg,
              }}
            >
              <Text
                style={{
                  fontSize: dimensions.fontTitle,
                  fontWeight: "bold",
                  color: theme.inputtitle,
                }}
              >
                {edit
                  ? t("modalCategory.title.edit")
                  : t("modalCategory.title.new")}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.8}
                style={{ padding: dimensions.sm }}
              >
                <Feather
                  name="x"
                  size={dimensions.iconLG}
                  color={theme.inputtitle}
                />
              </TouchableOpacity>
            </View>

            {/* Category Type */}
            <View style={{ marginBottom: dimensions.lg }}>
              <Text
                style={{
                  fontSize: dimensions.fontMD,
                  fontWeight: "600",
                  marginBottom: dimensions.sm,
                  color: theme.inputtitle,
                }}
              >
                {t("modalCategory.type")}
              </Text>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: dimensions.sm,
                      width: "100%",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => onChange("gelir")}
                      activeOpacity={0.8}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: dimensions.sm,
                        borderRadius: dimensions.borderRadiusLG,
                        borderWidth: 1,
                        paddingHorizontal: dimensions.md,
                        paddingVertical: dimensions.md,
                        backgroundColor:
                          value === "gelir" ? theme.success : theme.input,
                        borderColor:
                          value === "gelir" ? theme.success : theme.border,
                      }}
                    >
                      <Feather
                        name="trending-up"
                        size={dimensions.iconSM}
                        color={value === "gelir" ? "#fff" : theme.inputtitle}
                      />
                      <Text
                        style={{
                          fontWeight: "600",
                          color: value === "gelir" ? "#fff" : theme.inputtitle,
                          fontSize: dimensions.fontMD,
                        }}
                      >
                        {t("searchFilterBar.income")}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onChange("gider")}
                      activeOpacity={0.8}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: dimensions.sm,
                        borderRadius: dimensions.borderRadiusLG,
                        borderWidth: 1,
                        paddingHorizontal: dimensions.md,
                        paddingVertical: dimensions.md,
                        backgroundColor:
                          value === "gider" ? theme.error : theme.input,
                        borderColor:
                          value === "gider" ? theme.error : theme.border,
                      }}
                    >
                      <Feather
                        name="trending-down"
                        size={dimensions.iconSM}
                        color={value === "gider" ? "#fff" : theme.inputtitle}
                      />
                      <Text
                        style={{
                          fontWeight: "600",
                          color: value === "gider" ? "#fff" : theme.inputtitle,
                          fontSize: dimensions.fontMD,
                        }}
                      >
                        {t("searchFilterBar.expense")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

            {/* Category Name */}
            <View style={{ marginBottom: dimensions.lg }}>
              <Text
                style={{
                  marginLeft: dimensions.sm,
                  fontSize: dimensions.fontMD,
                  fontWeight: "600",
                  marginBottom: dimensions.sm,
                  color: theme.inputtitle,
                }}
              >
                {t("modalCategory.name")}
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder={t("modalCategory.namePlaceholder")}
                      placeholderTextColor={theme.inputplaceholder}
                      style={{
                        width: "100%",
                        borderRadius: dimensions.borderRadiusLG,
                        borderWidth: 1,
                        paddingHorizontal: dimensions.md,
                        paddingVertical: dimensions.md,
                        backgroundColor: theme.input,
                        borderColor: theme.border,
                        color: theme.inputtitle,
                      }}
                    />
                    {formState.errors.name && (
                      <Text
                        style={{
                          color: "red",
                          fontSize: dimensions.fontSM,
                          marginTop: 4,
                          marginLeft: dimensions.sm,
                        }}
                      >
                        {formState.errors.name.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Color Selection */}
            <View style={{ marginBottom: dimensions.lg }}>
              <Text
                style={{
                  marginLeft: dimensions.sm,
                  fontSize: dimensions.fontMD,
                  fontWeight: "600",
                  marginBottom: dimensions.sm,
                  color: theme.inputtitle,
                }}
              >
                {t("modalCategory.color")}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: dimensions.md,
                  paddingHorizontal: dimensions.md,
                  paddingVertical: dimensions.md,
                  borderRadius: dimensions.borderRadiusLG,
                  borderWidth: 1,
                  width: "100%",
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                }}
              >
                {selectedColor ? (
                  <View
                    style={{
                      width: dimensions.iconXL,
                      height: dimensions.iconXL,
                      borderRadius: dimensions.borderRadius,
                      borderWidth: 2,
                      borderColor: "rgba(255,255,255,0.3)",
                      backgroundColor: selectedColor,
                    }}
                  />
                ) : (
                  <Feather
                    name="droplet"
                    size={dimensions.iconMD}
                    color={theme.inputtitle}
                  />
                )}
                <Text
                  style={{
                    fontSize: dimensions.fontMD,
                    fontWeight: "500",
                    flex: 1,
                    color: theme.inputtitle,
                  }}
                >
                  {selectedColor
                    ? t("modalCategory.colorChange")
                    : t("modalCategory.colorSelect")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={dimensions.iconSM}
                  color={theme.inputtitle}
                />
              </TouchableOpacity>
              {formState.errors.color && (
                <Text
                  style={{
                    color: "red",
                    fontSize: dimensions.fontSM,
                    marginTop: 4,
                    marginLeft: dimensions.sm,
                  }}
                >
                  {formState.errors.color.message}
                </Text>
              )}
            </View>

            {/* Icon Selection */}
            <View style={{ marginBottom: dimensions.xl }}>
              <Text
                style={{
                  marginLeft: dimensions.sm,
                  fontSize: dimensions.fontMD,
                  fontWeight: "600",
                  marginBottom: dimensions.sm,
                  color: theme.inputtitle,
                }}
              >
                {t("modalCategory.icon")}
              </Text>
              <TouchableOpacity
                onPress={() => setIconModalVisible(true)}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: dimensions.md,
                  paddingHorizontal: dimensions.md,
                  paddingVertical: dimensions.md,
                  borderRadius: dimensions.borderRadiusLG,
                  borderWidth: 1,
                  width: "100%",
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                }}
              >
                {selectedIcon ? (
                  <Feather
                    name={selectedIcon as any}
                    size={dimensions.iconMD}
                    color={theme.inputtitle}
                  />
                ) : (
                  <Feather
                    name="grid"
                    size={dimensions.iconMD}
                    color={theme.inputtitle}
                  />
                )}
                <Text
                  style={{
                    fontSize: dimensions.fontMD,
                    fontWeight: "500",
                    flex: 1,
                    color: theme.inputtitle,
                  }}
                >
                  {selectedIcon
                    ? t("modalCategory.iconChange")
                    : t("modalCategory.iconSelect")}
                </Text>
                <Feather
                  name="chevron-right"
                  size={dimensions.iconSM}
                  color={theme.inputtitle}
                />
              </TouchableOpacity>
              {formState.errors.icon && (
                <Text
                  style={{
                    color: "red",
                    fontSize: dimensions.fontSM,
                    marginTop: 4,
                    marginLeft: dimensions.sm,
                  }}
                >
                  {formState.errors.icon.message}
                </Text>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={formState.isSubmitting}
              activeOpacity={0.8}
              style={{
                width: "100%",
                borderRadius: dimensions.borderRadiusLG,
                paddingHorizontal: dimensions.md,
                paddingVertical: dimensions.md,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: dimensions.sm,
                backgroundColor: theme.buttonprimary,
                opacity: formState.isSubmitting ? 0.6 : 1,
              }}
            >
              <Feather
                name={
                  formState.isSubmitting ? "loader" : edit ? "edit-2" : "save"
                }
                size={dimensions.iconSM}
                color={theme.white}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  color: theme.white,
                  fontSize: dimensions.fontMD,
                }}
              >
                {formState.isSubmitting
                  ? t("modalCategory.saving")
                  : edit
                  ? t("modalCategory.edit")
                  : t("modalCategory.save")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Controller
          control={control}
          name="color"
          render={({ field: { onChange } }) => (
            <ColorSelectionModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onColorSelect={(color) => {
                onChange(color);
                setModalVisible(false);
              }}
              selectedColor={selectedColor || undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="icon"
          render={({ field: { onChange } }) => (
            <Modal
              visible={iconModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIconModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: theme.white,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                    paddingHorizontal: dimensions.md,
                    paddingVertical: dimensions.md,
                  }}
                >
                  <Text
                    style={{
                      fontSize: dimensions.fontXL,
                      fontWeight: "bold",
                      color: theme.inputtitle,
                    }}
                  >
                    {t("modalCategory.iconModalTitle")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIconModalVisible(false)}
                    activeOpacity={0.8}
                    style={{ padding: dimensions.sm }}
                  >
                    <Feather
                      name="x"
                      size={dimensions.iconLG}
                      color={theme.inputtitle}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather
                    name="search"
                    size={dimensions.iconMD}
                    color={theme.inputtitle}
                    style={{ position: "absolute", left: wp(8), zIndex: 1000 }}
                  />
                  <TextInput
                    value={searchIcon}
                    onChangeText={setSearchIcon}
                    placeholder={t("modalCategory.iconPlaceholder")}
                    placeholderTextColor={theme.inputplaceholder}
                    style={{
                      flex: 1,
                      borderRadius: 99,
                      borderWidth: 1,
                      paddingHorizontal: wp(12),
                      paddingVertical: dimensions.md,
                      backgroundColor: theme.input,
                      borderColor: theme.border,
                      color: theme.inputtitle,
                      marginVertical: dimensions.sm,
                      marginHorizontal: dimensions.md,
                    }}
                  />
                  {searchIcon.length > 0 && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setSearchIcon("")}
                      style={{
                        position: "absolute",
                        zIndex: 1000,
                        right: wp(8),
                        padding: dimensions.sm,
                      }}
                    >
                      <Feather
                        name="x"
                        size={dimensions.iconMD}
                        color={theme.inputtitle}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <FlatList
                  data={filteredIcons}
                  renderItem={({ item }) => (
                    <IconItem item={item} onChange={onChange} />
                  )}
                  keyExtractor={(item) => item}
                  numColumns={5}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: dimensions.md }}
                />
              </View>
            </Modal>
          )}
        />
      </LinearGradient>
    </Modal>
  );
}
