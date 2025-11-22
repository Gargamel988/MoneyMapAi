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
      return; // Prevent multiple calls
    }
    hasInitializedRef.current = true;
    setHasInitialized(true);
    
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    // Set loading to false FIRST, before navigation
    setLoading(false);

    // Check current route to avoid unnecessary redirects
    const currentRoute = segments.join("/");
    const isOnAuthRoute = currentRoute.includes("(auth)");
    const isOnMainRoute = currentRoute.includes("(main)");

    if (session?.user) {
      if (!isOnMainRoute) {
        router.replace("/(screens)/(main)/home");
      } else {
      }
    } else {
      if (!isOnAuthRoute) {
        router.replace("/(screens)/(auth)/login");
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
        // Only handle auth changes after initial session
        if (event === "INITIAL_SESSION") {
          return;
        }

        // router.replace is idempotent, so we can call it even if already on the route
        if (session?.user) {
          router.replace("/(screens)/(main)/home");
        } else {
          router.replace("/(screens)/(auth)/login");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [hasInitialized]);

  return loading ? <LoadingScreen /> : children;
}
