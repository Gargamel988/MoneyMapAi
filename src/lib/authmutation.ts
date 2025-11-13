import { User } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { showErrorToast, showSuccessToast, showWarningToast } from '../constanst/toast';
import { SignInWithEmailProps, SignUpWithEmailProps } from '../types/authtype';
import { getsignInErrorMessage } from '../utils/authutils';
import { signInWithEmail, signUpWithEmail } from './authapi';
import { supabase } from './supabase';

const onpress = async (user: User): Promise<boolean> => {
  try {
    const profileData = {
      user_id: user.id,
      name: user.user_metadata.first_name || '', 
      username: user.user_metadata.username || user.user_metadata.last_name || '', 
      email: user.email || '',
      currency: 'TRY',
      theme: 'system',
    };
    
    const { error } = await supabase
      .from('profiles')
      .insert([profileData]);
    
    if (error) {
      showWarningToast('Uyarı', `Profil oluşturulamadı: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (error) {
    showErrorToast('Hata', 'Beklenmeyen bir hata oluştu: ' + (error as Error).message);
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
        showErrorToast('Hata', 'Kayıt başarılı ama kullanıcı bilgisi alınamadı.');
        return;
      }
      
      showSuccessToast('Başarılı', 'Kayıt başarılı bir şekilde gerçekleşti.');
      
      const profileCreated = await onpress(authData.user);
      if (!profileCreated) {
        return;
      }
      
    
      
      router.push('/(screens)/(auth)/email-control');
      resetRegister();
    },
    onError: (error: Error) => {
      if (error.message.includes('already registered')) {
        showErrorToast('Hata', 'Bu email adresi zaten kullanılmaktadır.');
        return;
      }

      showErrorToast('Hata', 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    },
  });
  
  const {
    mutate: login,
    isPending: isLoggingIn,
    reset: resetLogin,
  } = useMutation({
    mutationFn: (data: SignInWithEmailProps) => signInWithEmail(data),
    onSuccess: (authData: any) => {
<<<<<<< HEAD
=======
      // ✅ signInWithEmail de null dönebilir
>>>>>>> 2742bcc (ilk yükleme)
      if (!authData) {
        resetLogin();
        return;
      }
      
      showSuccessToast('Başarılı', 'Giriş başarılı bir şekilde gerçekleşti.');
      router.push('/(screens)/(main)/home' as never);
       resetLogin();
    },
    onError: (error: any) => {
      showErrorToast('Hata', getsignInErrorMessage(error));
    },
  });
  
  return { register, isRegistering, login, isLoggingIn, resetRegister, resetLogin };
};
