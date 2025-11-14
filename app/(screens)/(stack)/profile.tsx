import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ModalCurrency } from "../../../src/components/setting/modal-currency";
import ModalLanguage from "../../../src/components/setting/modal-language";
import { ProfileCard } from "../../../src/components/ui/profile-card";
import { showErrorToast, showSuccessToast } from "../../../src/constanst/toast";
import { useTheme } from "../../../src/contexts/theme";
import { hp, useResponsive, wp } from "../../../src/hooks/useRespons";
import { getProfil, updateAvatar, updatecurrency, updatename, updateusername } from "../../../src/lib/profil";
import { avatar } from "../../../src/utils/avatar";

// Form types
interface NameFormData {
  name: string;
}

interface UsernameFormData {
  username: string;
}

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { dimensions } = useResponsive();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState<string | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const nameForm = useForm<NameFormData>({
    defaultValues: {
      name: "",
    },
  });
  const usernameForm = useForm<UsernameFormData>({
    defaultValues: {
      username: "",
    },
  });
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfil(),
  });
  const createdAt = new Date(profileData?.data?.created_at).toLocaleDateString(
    i18n.language === "tr" ? "tr-TR" : "en-US",
    { day: "2-digit", month: "long", year: "numeric" }
  );

  const mutation = useMutation({
    mutationFn: async (currency: string) => {
      const data = await updatecurrency(currency);
      if (!data) {
        throw new Error(t("profile.currency.updateError"));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccessToast(t("common.success"), t("profile.currency.updateSuccess"));
      setShowModal("currency");
    },
    onError: async () => {
      showErrorToast(t("common.error"), t("profile.currency.updateError"));
      setShowModal("currency");
    },
  });
  const mutationname = useMutation({
    mutationFn: async (name: string) => {
      const data = await updatename(name);
      if (!data) {
        throw new Error(t("profile.name.updateError"));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccessToast(t("common.success"), t("profile.name.updateSuccess"));
      setShowModal(null);
      nameForm.reset();
    },
    onError: async () => {
      showErrorToast(t("common.error"), t("profile.name.updateError"));
    },
  });
  const mutationavatar = useMutation({
    mutationFn: async (avatar: string) => {
      const data = await updateAvatar(avatar.toString());
      if (!data) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["profil"] });
      showSuccessToast(t("common.success"), t("profile.avatar.updateSuccess"));
      setShowModal(null);
    },
    onError: async (error: any) => {
      showErrorToast(t("common.error"), error.message);
    },
  });
  const mutationusername = useMutation({
    mutationFn: async (username: string) => {
      const data = await updateusername(username);
      if (!data) {
        throw new Error(t("profile.username.updateError"));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccessToast(t("common.success"), t("profile.username.updateSuccess"));
      setShowModal(null);
      usernameForm.reset();
    },
    onError: async () => {
      showErrorToast(t("common.error"), t("profile.username.updateError"));
    },
  });

  // Name Modal Component
  const NameModal = () => {
    const onSubmitName = (data: NameFormData) => {
      mutationname.mutate(data.name);
    };

    return (
      <Modal
        visible={showModal === "name"}
        onRequestClose={() => setShowModal(null)}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            paddingHorizontal: wp(5),
          }}
        >
          <View
            style={{
              backgroundColor: theme.white,
              borderRadius: dimensions.borderRadiusLG,
              padding: dimensions.lg,
            }}
          >
            <Text
              style={{
                fontSize: dimensions.fontTitle,
                fontWeight: "bold",
                color: theme.textSenary,
                marginBottom: hp(2),
                textAlign: "center",
              }}
            >
              {t("profile.name.modalTitle")}
            </Text>

            <Controller
              control={nameForm.control}
              name="name"
              rules={{ required: t("profile.name.required") }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder={t("profile.name.placeholder")}
                  value={value}
                  onChangeText={onChange}
                  style={{
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: dimensions.borderRadiusLG,
                    padding: dimensions.md,
                    fontSize: dimensions.fontMD,
                    color: theme.textSenary,
                    backgroundColor: theme.white,
                    marginBottom: hp(2),
                  }}
                />
              )}
            />

            <View style={{ flexDirection: "row", gap: wp(3) }}>
              <TouchableOpacity
                onPress={() => setShowModal(null)}
                style={{
                  flex: 1,
                  backgroundColor: theme.border,
                  padding: dimensions.md,
                  borderRadius: dimensions.borderRadiusLG,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.textSenary, fontWeight: "600" }}>
                  {t("profile.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={nameForm.handleSubmit(onSubmitName)}
                disabled={mutationname.isPending}
                style={{
                  flex: 1,
                  backgroundColor: theme.primary,
                  padding: dimensions.md,
                  borderRadius: dimensions.borderRadiusLG,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {mutationname.isPending ? t("profile.saving") : t("profile.save")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Username Modal Component
  const UsernameModal = () => {
    const onSubmitUsername = (data: UsernameFormData) => {
      mutationusername.mutate(data.username);
    };

    return (
      <Modal
        visible={showModal === "username"}
        onRequestClose={() => setShowModal(null)}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            paddingHorizontal: wp(5),
          }}
        >
          <View
            style={{
              backgroundColor: theme.white,
              borderRadius: dimensions.borderRadiusLG,
              padding: dimensions.lg,
            }}
          >
            <Text
              style={{
                fontSize: dimensions.fontTitle,
                fontWeight: "bold",
                color: theme.textSenary,
                marginBottom: hp(2),
                textAlign: "center",
              }}
            >
              {t("profile.username.modalTitle")}
            </Text>

            <Controller
              control={usernameForm.control}
              name="username"
              rules={{ required: t("profile.username.required") }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder={t("profile.username.placeholder")}
                  value={value}
                  onChangeText={onChange}
                  style={{
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: dimensions.borderRadiusLG,
                    padding: dimensions.md,
                    fontSize: dimensions.fontMD,
                    color: theme.textSenary,
                    backgroundColor: theme.white,
                    marginBottom: hp(2),
                  }}
                />
              )}
            />

            <View style={{ flexDirection: "row", gap: wp(3) }}>
              <TouchableOpacity
                onPress={() => setShowModal(null)}
                style={{
                  flex: 1,
                  backgroundColor: theme.border,
                  padding: dimensions.md,
                  borderRadius: dimensions.borderRadiusLG,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.textSenary, fontWeight: "600" }}>
                  {t("profile.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={usernameForm.handleSubmit(onSubmitUsername)}
                disabled={mutationusername.isPending}
                style={{
                  flex: 1,
                  backgroundColor: theme.primary,
                  padding: dimensions.md,
                  borderRadius: dimensions.borderRadiusLG,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {mutationusername.isPending ? t("profile.saving") : t("profile.save")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const modalname = (modalname: string) => {
    switch (modalname) {
      case "currency":
        return (
          <ModalCurrency
            showCurrencyModal={showModal === "currency"}
            setShowCurrencyModal={() => setShowModal(null)}
            currency={profileData?.data?.currency}
            mutation={mutation}
          />
        );
      case "name":
        return <NameModal />;
      case "username":
        return <UsernameModal />;
      default:
        return null;
    }
  };
  const getAvatarSource = () => {
    if (!profileData?.data?.avatar_url) return null;
    
    // Eğer avatar_url bir sayı ise (1-10 arası)
    const avatarId = Number(profileData.data.avatar_url);
    if (!isNaN(avatarId) && avatarId >= 1 && avatarId <= 10) {
      const avatarItem = avatar.find(item => item.id === avatarId);
      return avatarItem ? avatarItem.image : null;
    }
    
    // Değilse URL olarak kullan
    return { uri: profileData.data.avatar_url };
  };
  const modalavatar = () => {
    return (
      <Modal
        visible={showModal === "avatar"}
        onRequestClose={() => setShowModal(null)}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            paddingHorizontal: wp(5),
          }}
        >
          <View
            style={{
              backgroundColor: theme.white,
              borderRadius: dimensions.borderRadiusLG,
              padding: dimensions.lg,
            }}
          >
            <Text
              style={{
                fontSize: dimensions.fontTitle,
                fontWeight: "bold",
                color: theme.textSenary,
                marginBottom: hp(1.5),
                textAlign: "center",
              }}
            >
              {t("profile.avatar.modalTitle")}
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: theme.textSecondary,
                marginBottom: hp(2),
              }}
            >
              {t("profile.avatar.description")}
            </Text>

            <FlatList
              data={avatar}
              keyExtractor={(item: (typeof avatar)[0]) => item.id.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: hp(1.5),
              }}
              renderItem={({ item }: { item: (typeof avatar)[0] }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    mutationavatar.mutate(item.id.toString());
                    setShowModal(null);
                  }}
                  style={{
                    width: wp(24),
                    height: wp(24),
                    borderRadius: 99,
                    borderWidth: 2,
                    borderColor: theme.border,
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={item.image}
                    resizeMode="contain"
                    borderRadius={99}
                    style={{ width: "100%", height: "100%" }}
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: dimensions.md }}
            />

            <TouchableOpacity
              onPress={() => setShowModal(null)}
              style={{
                marginTop: hp(1),
                backgroundColor: theme.border,
                padding: dimensions.md,
                borderRadius: dimensions.borderRadiusLG,
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.textSenary, fontWeight: "600" }}>
                {t("profile.close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: wp(5),
            paddingTop: hp(2.5),
          }}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={dimensions.fontTitle}
            color={theme.text}
          />
          <Text
            style={{
              fontSize: dimensions.fontTitle,
              fontWeight: "bold",
              color: theme.text,
              marginLeft: 10,
            }}
          >
            {t("profile.title")}
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", paddingVertical: dimensions.md }}>
          <TouchableOpacity
            onPress={() => {
              setShowModal("avatar");
            }}
            style={{
              position: "absolute",
              top: hp(15),
              left: wp(55),
              width: wp(10),
              height: hp(5),
              borderRadius: 99,
              backgroundColor: theme.primary,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              borderWidth: 2,
              borderColor: theme.white,
            }}
          >
            <Ionicons
              name="camera"
              size={dimensions.fontMD}
              color={theme.text}
            />
          </TouchableOpacity>
          <View
            style={{
              width: wp(34),
              height: hp(17),
              borderRadius: 99,
              borderWidth: 4,
              borderColor: theme.border,
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {profileData?.data?.avatar_url ? (
              <Image
                source={getAvatarSource()}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 99,
                  backgroundColor: theme.white,
                }}
                resizeMode="contain"
              />
            ) : (
              <Text
                style={{
                  backgroundColor: theme.cluebackground,
                  borderRadius: 99,
                  width: "100%",
                  height: "100%",
                  fontSize: dimensions.fontTitle,
                  fontWeight: "bold",
                  color: theme.textSenary,
                  textAlignVertical: "center",
                  textAlign: "center",
                }}
              >
                {profileData?.data?.name?.charAt(0)}{" "}
                {profileData?.data?.username?.charAt(0)}
              </Text>
            )}
          </View>

          <Text
            style={{
              fontSize: dimensions.fontTitle * 1.1,
              fontWeight: "bold",
              color: theme.text,
              marginBottom: hp(0.5),
            }}
          >
            {profileData?.data?.name} {profileData?.data?.username}
          </Text>
          <Text
            style={{
              fontSize: dimensions.fontSM * 1.1,
              color: theme.textSecondary,
            }}
          >
            {profileData?.data?.user_id}
          </Text>
        </View>

        <View style={{ paddingHorizontal: wp(6), gap: hp(1.5) }}>
          <ProfileCard
            icon="person"
            label={t("profile.labels.name")}
            value={profileData?.data?.name}
            onPress={() => {
              nameForm.setValue("name", profileData?.data?.name || "");
              setShowModal("name");
            }}
          />
          <ProfileCard
            icon="person-outline"
            label={t("profile.labels.lastName")}
            value={profileData?.data?.username}
            onPress={() => {
              usernameForm.setValue(
                "username",
                profileData?.data?.username || ""
              );
              setShowModal("username");
            }}
          />
          <ProfileCard
            icon="mail"
            label={t("profile.labels.email")}
            value={profileData?.data?.email}
            onPress={() => {}}
          />
          <ProfileCard
            icon="color-palette"
            label={t("profile.labels.theme")}
            value={theme.name}
            onPress={() => {
              router.push("/(screens)/(stack)/ThemeSelector");
            }}
          />
          <ProfileCard
            icon="cash"
            label={t("profile.labels.currency")}
            value={profileData?.data?.currency}
            onPress={() => setShowModal("currency")}
          /> 
           <ProfileCard
          icon="globe"
          label={t("profile.labels.language")}
          value={profileData?.data?.language?.toUpperCase()}
          onPress={() => setShowLanguageModal(true)}
        />
          {modalname("currency")}
          {modalname("name")}
          {modalname("username")}
          {modalavatar()}
          <ProfileCard
            icon="calendar"
            label={t("profile.labels.createdAt")}
            value={createdAt}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
      {showLanguageModal && (
        <ModalLanguage
          showLanguageModal={showLanguageModal}
          setShowLanguageModal={setShowLanguageModal}
          language={profileData?.data?.language}
        />
      )}
    </SafeAreaView>
  );
}
