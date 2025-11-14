import { useAuth } from "@/src/hooks/useAuth";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next";
import { GreenLoadingComponent } from "../src/components/common/loading";

export default function Index() {
  const { isLoading, user } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <GreenLoadingComponent text={t("common.loading")} />;
  
  }

  if (user) {
    return <Redirect href="/(screens)/(main)/home" />; 
  }
  if (!user) {
    return <Redirect href="/(screens)/(auth)/welcome" />;
  }

  return <Redirect href="/(screens)/(auth)/welcome" />;
}