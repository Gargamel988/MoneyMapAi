import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const { t } = useTranslation();
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



    Alert.alert(t('auth.signOut.title'), t('auth.signOut.message'), [
      {
        text: t('common.cancel'),
        style: "cancel",
        isPreferred: true,
      },
      {
        text: t('auth.signOut.confirm'),
        onPress: async () => await supabase.auth.signOut().then(() => router.replace('/(screens)/(auth)/login' )),
        style: 'destructive',
      },
    ]);
  };

  return { user, isLoading, authError, session, signOut };
};
