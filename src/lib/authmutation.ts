import { User } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import i18next from '../../services/i18next';
import { showErrorToast, showSuccessToast, showWarningToast } from '../constanst/toast';
import { SignInWithEmailProps, SignUpWithEmailProps } from '../types/authtype';
import { getsignInErrorMessage } from '../utils/authutils';
import { signInWithEmail, signUpWithEmail } from './authapi';
import { insertDefaultExpenseCategories, insertDefaultIncomeCategories } from './category';
import { supabase } from './supabase';

const onpress = async (user: User): Promise<boolean> => {
  try {
    // Mevcut dili al (varsayılan: 'tr')
    const currentLanguage = (i18next.language || 'tr').split('-')[0];
    
    const profileData = {
      user_id: user.id,
      name: user.user_metadata.first_name || '', 
      username: user.user_metadata.username || user.user_metadata.last_name || '', 
      email: user.email || '',
      currency: 'TRY',
      theme: 'system',
      language: currentLanguage,
    };
    
    const { error } = await supabase
      .from('profiles')
      .insert([profileData]);
    
    if (error) {
      showWarningToast(i18next.t('common.warning'), i18next.t('auth.profile.warning', { message: error.message }));
      return false;
    }
    
    return true;
  } catch (error) {
    showErrorToast(i18next.t('common.error'), i18next.t('auth.profile.error.unexpected', { message: (error as Error).message }));
    return false;
  }
};
export const useAuthsignupMutation = () => {

  
  const {
    mutate: register,
    isPending: isRegistering,
    reset: resetRegister,
  } = useMutation({
    mutationFn: (data: SignUpWithEmailProps) => signUpWithEmail(data),
    onSuccess: async (authData) => {
      if (!authData?.user) {
        showErrorToast(i18next.t('common.error'), i18next.t('auth.register.error.userInfo'));
        return;
      }
      
      showSuccessToast(i18next.t('common.success'), i18next.t('auth.register.success'));
      
      const profileCreated = await onpress(authData.user);
      if (!profileCreated) {
        return;
      }
      
      // Varsayılan kategorileri oluştur
      try {
        await Promise.all([
          insertDefaultExpenseCategories(authData.user),
          insertDefaultIncomeCategories(authData.user)
        ]);
      } catch (error) {
        console.error('Error creating default categories:', error);
        // Kategori oluşturma hatası kayıt işlemini durdurmaz
      }
      
      router.push('/(screens)/(auth)/email-control');
      resetRegister();
    },
    onError: (error: Error) => {
      if (error.message.includes('already registered')) {
        showErrorToast(i18next.t('common.error'), i18next.t('auth.register.error.emailExists'));
        return;
      }

      showErrorToast(i18next.t('common.error'), i18next.t('auth.register.error.general'));
    },
  });
  
  const {
    mutate: login,
    isPending: isLoggingIn,
    reset: resetLogin,
  } = useMutation({
    mutationFn: (data: SignInWithEmailProps) => signInWithEmail(data),
    onSuccess: (authData: any) => {
      // ✅ signInWithEmail de null dönebilir
      if (!authData) {
        resetLogin();
        return;
      }
      
      showSuccessToast(i18next.t('common.success'), i18next.t('auth.login.success'));
      router.push('/(screens)/(main)/home' as never);
       resetLogin();
    },
    onError: (error: any) => {
      showErrorToast(i18next.t('common.error'), getsignInErrorMessage(error));
    },
  });
  
  return { register, isRegistering, login, isLoggingIn, resetRegister, resetLogin };
};
