import { LoadingScreen } from "@/src/components/common/loading";
import { supabase } from "@/src/lib/supabase";
import { router, useRootNavigationState, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const hasInitializedRef = useRef(false);
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  
  // Router'ın hazır olup olmadığını kontrol et
  const isNavigationReady = navigationState?.key != null;
  
  const loadSession = async () => {
    if (hasInitializedRef.current || !isNavigationReady) {
      return;
    }
    hasInitializedRef.current = true;
    setHasInitialized(true);
    
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      setLoading(false);

      const currentRoute = segments.join("/");
      const isOnAuthRoute = currentRoute.includes("(auth)");
      const isOnMainRoute = currentRoute.includes("(main)");
      const isOnRoot = currentRoute === "" || currentRoute === "index";

      if (session?.user) {
        if (!isOnMainRoute) {
          router.replace("/(screens)/(main)/home");
        }
      } else {
        if (!isOnAuthRoute && !isOnRoot) {
          router.replace("/");
        }
      }
    } catch (error) {
      console.error("Session load error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isNavigationReady) {
      loadSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavigationReady]);

  useEffect(() => {
    if (!hasInitialized) {
      return;
    }
    
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "INITIAL_SESSION") {
          return;
        }

        if (session?.user) {
          router.replace("/(screens)/(main)/home");
        } else {
          router.replace("/");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [hasInitialized]);

  return loading ? <LoadingScreen /> : children;
}