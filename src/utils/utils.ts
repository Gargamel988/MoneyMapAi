import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  // Development modunda
  if (process.env.NODE_ENV === 'development' && Constants.experienceUrl) {
    const origin = Constants.experienceUrl.replace('exp://', 'http://');
    return origin.concat(path);
  }

  // Production veya experienceUrl yoksa
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  
  if (!baseUrl) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',
    );
  }

  return baseUrl.concat(path);
};