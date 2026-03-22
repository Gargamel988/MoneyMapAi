import { supabase } from "@/src/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface SessionContextType {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // İlk oturum yükleme
        const loadSession = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                setSession(data.session);
            } catch (error) {
                console.error("Session load error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSession();

        // Auth state değişikliklerini dinle
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, newSession) => {
                if (event === "INITIAL_SESSION") {
                    return;
                }
                setSession(newSession);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setSession(null);
    }, []);

    return (
        <SessionContext.Provider
            value={{
                session,
                user: session?.user ?? null,
                isLoading,
                signOut,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}
