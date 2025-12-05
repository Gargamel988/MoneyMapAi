import { LoadingScreen } from "@/src/components/common/loading";
import { supabase } from "@/src/lib/supabase";
import { router, useSegments } from "expo-router";
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
  
  
  const loadSession = async () => {
    if (hasInitializedRef.current) {
      return;
    }
    hasInitializedRef.current = true;
    setHasInitialized(true);
    
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
      } else {
      }
    } else {
      if (!isOnAuthRoute && !isOnRoot) {
        router.replace("/");
      } else {
      }
    }
  };

  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
