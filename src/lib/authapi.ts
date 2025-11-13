import { Alert } from 'react-native';
import { showErrorToast, showSuccessToast } from '../constanst/toast';
import { SignInWithEmailProps, SignUpWithEmailProps } from '../types/authtype';
import { getErrorMessage } from '../utils/authutils';
import { supabase } from './supabase';


const signInWithEmail = async (data: SignInWithEmailProps) => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email.trim(),
    password: data.password.trim(),
  });
  if (authData.user?.identities?.length === 0) {
    Alert.alert('Hata', 'Email adresiniz doğrulanmamış. Lütfen mailinizi kontrol edin ve doğrulama bağlantısına tıklayın.');
    return null;
  }
  if (error) {
    showErrorToast('Hata', getErrorMessage(error));
    return null;
  }

  return authData;
};

const signUpWithEmail = async (data: SignUpWithEmailProps) => {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email.trim(),
      password: data.password.trim(),
      options: {
        data: {
          first_name: data.first_name.trim(),
          last_name: data.last_name.trim(),
        },
      },
    });

    if (error) {
      showErrorToast('Hata', getErrorMessage(error));

      return null;
    }

    return authData;
  } catch (error: any) {
    showErrorToast('Hata', getErrorMessage(error));
    return null;
  }
};


const updateEmail = async (email: string) => {
  const { data, error } = await supabase.auth.updateUser({ email });
  if (error) {
    showErrorToast('Hata', getErrorMessage(error));
    return null;
  }
  if (!data.user) {
    showErrorToast('Hata', 'Email güncellenemedi');
    return null;
  }
  const { data: updatedData, error: updatedError } = await supabase
    .from('profiles')
    .update({ email: email })
    .eq('user_id', data.user.id);
	if(updatedData) {
		showSuccessToast('Başarılı', 'Email güncellendi');
	}
  if (updatedError) {
    showErrorToast('Hata', updatedError.message);
    return null;
  }
  return updatedData;
};

export { signInWithEmail, signUpWithEmail, updateEmail };

