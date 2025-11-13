// toast.config.ts
import Toast, { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#10b981',
        borderLeftWidth: 5,
        backgroundColor: '#f0fdf4',
        height: 70,
        paddingVertical: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#065f46',
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
        color: '#166534',
        lineHeight: 18,
      }}
      text2NumberOfLines={2}
    />
  ),
  
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#ef4444',
        borderLeftWidth: 5,
        backgroundColor: '#fef2f2',
        height: 70,
        paddingVertical: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#991b1b',
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
        color: '#b91c1c',
        lineHeight: 18,
      }}
      text2NumberOfLines={2}
    />
  ),
  
  info: (props: any) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: '#3b82f6',
        borderLeftWidth: 5,
        backgroundColor: '#eff6ff',
        height: 70,
        paddingVertical: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#1e40af',
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
        color: '#2563eb',
        lineHeight: 18,
      }}
      text2NumberOfLines={2}
    />
  ),
  
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#f59e0b',
        borderLeftWidth: 5,
        backgroundColor: '#fffbeb',
        height: 70,
        paddingVertical: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#92400e',
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
        color: '#b45309',
        lineHeight: 18,
      }}
      text2NumberOfLines={2}
    />
  ),
};

// Kullanım örnekleri:

// ✅ Success Toast
export const showSuccessToast = (title: string, message?: string) => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
    topOffset: 50,
  });
};

// ❌ Error Toast
export const showErrorToast = (title: string, message?: string) => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 4000,
    topOffset: 50,
  });
};

// ℹ️ Info Toast
export const showInfoToast = (title: string, message?: string) => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
    topOffset: 50,
  });
};

// ⚠️ Warning Toast
export const showWarningToast = (title: string, message?: string) => {
  Toast.show({
    type: 'warning',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3500,
    topOffset: 50,
  });
};