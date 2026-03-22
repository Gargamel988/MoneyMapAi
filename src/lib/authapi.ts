import { Alert } from 'react-native';
import i18next from '../../services/i18next';
import { showErrorToast, showSuccessToast } from '../constants/toast';
import { SignInWithEmailProps, SignUpWithEmailProps } from '../types/authtype';
import { getErrorMessage } from '../utils/authutils';
import { supabase } from './supabase';


const signInWithEmail = async (data: SignInWithEmailProps) => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email.trim(),
    password: data.password.trim(),
  });
  if (authData.user?.identities?.length === 0) {
    Alert.alert(i18next.t('common.error'), i18next.t('auth.email.notVerified'));
    return null;
  }
  if (error) {
    showErrorToast(i18next.t('common.error'), getErrorMessage(error));
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
      showErrorToast(i18next.t('common.error'), getErrorMessage(error));

      return null;
    }

    return authData;
  } catch (error: any) {
    showErrorToast(i18next.t('common.error'), getErrorMessage(error));
    return null;
  }
};


const updateEmail = async (email: string) => {
  const { data, error } = await supabase.auth.updateUser({ email });
  if (error) {
    showErrorToast(i18next.t('common.error'), getErrorMessage(error));
    return null;
  }
  if (!data.user) {
    showErrorToast(i18next.t('common.error'), i18next.t('auth.email.updateFailed'));
    return null;
  }
  const { data: updatedData, error: updatedError } = await supabase
    .from('profiles')
    .update({ email: email })
    .eq('user_id', data.user.id);
	if(updatedData) {
		showSuccessToast(i18next.t('common.success'), i18next.t('auth.email.updateSuccess'));
	}
  if (updatedError) {
    showErrorToast(i18next.t('common.error'), updatedError.message);
    return null;
  }
  return updatedData;
};

export { signInWithEmail, signUpWithEmail, updateEmail };

