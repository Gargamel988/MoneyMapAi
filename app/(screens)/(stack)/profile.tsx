import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
<<<<<<< HEAD
  FlatList,
=======
>>>>>>> 2742bcc (ilk yükleme)
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
import { ProfileCard } from "../../../src/components/ui/profile-card";
import { showErrorToast, showSuccessToast } from "../../../src/constanst/toast";
import { useTheme } from "../../../src/contexts/theme";
import { hp, useResponsive, wp } from "../../../src/hooks/useRespons";
import {
  getProfil,
<<<<<<< HEAD
  updateAvatar,
=======
>>>>>>> 2742bcc (ilk yükleme)
  updatecurrency,
  updatename,
  updateusername,
} from "../../../src/lib/profil";
<<<<<<< HEAD
import { avatar } from "../../../src/utils/avatar";
=======
>>>>>>> 2742bcc (ilk yükleme)

// Form types
interface NameFormData {
  name: string;
}

interface UsernameFormData {
  username: string;
}

export default function ProfilePage() {
  const { theme } = useTheme();
  const { dimensions } = useResponsive();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState<string | null>(null);

<<<<<<< HEAD
=======
  // Form controllers
>>>>>>> 2742bcc (ilk yükleme)
  const nameForm = useForm<NameFormData>({
    defaultValues: {
      name: "",
    },
  });
<<<<<<< HEAD
=======

>>>>>>> 2742bcc (ilk yükleme)
  const usernameForm = useForm<UsernameFormData>({
    defaultValues: {
      username: "",
    },
  });
<<<<<<< HEAD
=======

>>>>>>> 2742bcc (ilk yükleme)
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfil(),
  });
<<<<<<< HEAD
=======

>>>>>>> 2742bcc (ilk yükleme)
  const createdAt = new Date(profileData?.data?.created_at).toLocaleDateString(
    "tr-TR",
    { day: "2-digit", month: "long", year: "numeric" }
  );

  const mutation = useMutation({
    mutationFn: async (currency: string) => {
      const data = await updatecurrency(currency);
      if (!data) {
        throw new Error("Para birimi güncellenemedi");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccessToast("Başarılı", "Para birimi güncellendi");
      setShowModal("currency");
    },
<<<<<<< HEAD
    onError: async () => {
      showErrorToast("Hata", "Para birimi güncellenemedi");
      setShowModal("currency");
    },
  });
=======
    onError: async (error: any) => {
      showErrorToast("Hata", "Para birimi güncellenemedi");
      console.error("error", error);
      setShowModal("currency");
    },
  });

>>>>>>> 2742bcc (ilk yükleme)
  const mutationname = useMutation({
    mutationFn: async (name: string) => {
      const data = await updatename(name);
      if (!data) {
        throw new Error("Ad güncellenemedi");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccessToast("Başarılı", "Ad güncellendi");
      setShowModal(null);
      nameForm.reset();
    },
<<<<<<< HEAD
    onError: async () => {
      showErrorToast("Hata", "Ad güncellenemedi");
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
      showSuccessToast("Başarılı", "Avatar güncellendi");
      setShowModal(null);
    },
    onError: async (error: any) => {
      showErrorToast("Hata", error.message);
    },
  });
=======
    onError: async (error: any) => {
      showErrorToast("Hata", "Ad güncellenemedi");
      console.error("error", error);
    },
  });

>>>>>>> 2742bcc (ilk yükleme)
  const mutationusername = useMutation({
    mutationFn: async (username: string) => {
      const data = await updateusername(username);
      if (!data) {
        throw new Error("Kullanıcı adı güncellenemedi");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccessToast("Başarılı", "Kullanıcı adı güncellendi");
      setShowModal(null);
      usernameForm.reset();
    },
<<<<<<< HEAD
    onError: async () => {
      showErrorToast("Hata", "Kullanıcı adı güncellenemedi");
=======
    onError: async (error: any) => {
      showErrorToast("Hata", "Kullanıcı adı güncellenemedi");
      console.error("error", error);
>>>>>>> 2742bcc (ilk yükleme)
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
              Ad Güncelle
            </Text>

            <Controller
              control={nameForm.control}
              name="name"
              rules={{ required: "Ad gereklidir" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Adınızı girin"
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
                  İptal
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
                  {mutationname.isPending ? "Kaydediliyor..." : "Kaydet"}
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
              Kullanıcı Adı Güncelle
            </Text>

            <Controller
              control={usernameForm.control}
              name="username"
              rules={{ required: "Kullanıcı adı gereklidir" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Kullanıcı adınızı girin"
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
                  İptal
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
                  {mutationusername.isPending ? "Kaydediliyor..." : "Kaydet"}
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
<<<<<<< HEAD
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
              Avatar Seç
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: theme.textSecondary,
                marginBottom: hp(2),
              }}
            >
              Profil fotoğrafınız olarak kullanmak için bir avatar seçin.
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
                Kapat
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
=======
>>>>>>> 2742bcc (ilk yükleme)

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
            Profil
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", paddingVertical: dimensions.md }}>
<<<<<<< HEAD
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
=======
>>>>>>> 2742bcc (ilk yükleme)
          <View
            style={{
              width: wp(34),
              height: hp(17),
              borderRadius: 99,
              borderWidth: 4,
<<<<<<< HEAD
              borderColor: theme.border,
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
=======
              borderColor: "#FFF",
              justifyContent: "center",
              alignItems: "center",
>>>>>>> 2742bcc (ilk yükleme)
            }}
          >
            {profileData?.data?.avatar_url ? (
              <Image
<<<<<<< HEAD
                source={getAvatarSource()}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 99,
                  backgroundColor: theme.white,
                }}
                resizeMode="contain"
              />
=======
                source={{ uri: profileData?.data?.avatar_url }}
                style={{ width: wp(34), height: hp(17) , borderRadius: 99 }}
              /> 
>>>>>>> 2742bcc (ilk yükleme)
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
            label="Ad"
            value={profileData?.data?.name}
            onPress={() => {
              nameForm.setValue("name", profileData?.data?.name || "");
              setShowModal("name");
            }}
          />
          <ProfileCard
            icon="person-outline"
            label="Soyad"
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
            label="E-posta"
            value={profileData?.data?.email}
            onPress={() => {}}
          />
          <ProfileCard
            icon="color-palette"
            label="Tema"
            value={theme.name}
            onPress={() => {
              router.push("/(screens)/(stack)/ThemeSelector");
            }}
          />
          <ProfileCard
            icon="cash"
            label="Para Birimi"
            value={profileData?.data?.currency}
            onPress={() => setShowModal("currency")}
          />
          {modalname("currency")}
          {modalname("name")}
          {modalname("username")}
<<<<<<< HEAD
          {modalavatar()}
=======
>>>>>>> 2742bcc (ilk yükleme)
          <ProfileCard
            icon="calendar"
            label="Oluşturulma Tarihi"
            value={createdAt}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
