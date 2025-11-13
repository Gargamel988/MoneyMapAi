import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setAuthError(error.message as string);
        }

        if (mounted) {
          setUser(session?.user ?? null);
          setSession(session ?? null);
        }
      } catch  {
        if (mounted) {
          setAuthError('Authentication initialization failed');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setSession(session ?? null);
        setIsLoading(false);
        setAuthError(null);

        if (event === 'SIGNED_OUT') {
        } else if (event === 'TOKEN_REFRESHED') {
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const signOut = async () => {



    Alert.alert("Çıkış Yapılıyor...", "Çıkış yapmak istediğinize emin misiniz?", [
      {
        text: "İptal",
        style: "cancel",
        isPreferred: true,
      },
      {
        text: "Çıkış Yap",
<<<<<<< HEAD
        onPress: async () => await supabase.auth.signOut().then(() => router.replace('/(screens)/(auth)/login' )),
=======
        onPress: async () => await supabase.auth.signOut().then(() => router.push('/(screens)/(auth)/login' )),
>>>>>>> 2742bcc (ilk yükleme)
        style: 'destructive',
      },
    ]);
  };

  return { user, isLoading, authError, session, signOut };
};
