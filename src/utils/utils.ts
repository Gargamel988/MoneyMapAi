import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  // Development modunda - Expo Router API route'ları sadece web modunda çalışır
  if (__DEV__) {
    const host = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
    const port = '8081';
    return `http://${host}:${port}${path}`;
  }

  // Production modunda - app.json'daki origin URL'ini kullan
  // Bu URL EAS Hosting'e deploy edilmiş olmalı
  const origin = Constants.expoConfig?.extra?.router?.origin || 
                 Constants.expoConfig?.plugins?.find((p: any) => p[0] === 'expo-router')?.[1]?.origin ||
                 process.env.EXPO_PUBLIC_API_BASE_URL;
  
  if (!origin) {
    throw new Error('API origin URL is not defined. Please deploy to EAS Hosting or set EXPO_PUBLIC_API_BASE_URL');
  }

  return `${origin}${path}`;
};