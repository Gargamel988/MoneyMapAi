import mobileAds from "react-native-google-mobile-ads";
import Constants from "expo-constants";

export const initAds = () => {
  // Expo Go'da reklamları başlatma (çökmeyi önler)
  if (Constants.appOwnership === 'expo') {
    console.log('Running in Expo Go, skipping real AdMob initialization');
    return Promise.resolve({});
  }

  return mobileAds()
    .initialize()
    .then((adapterStatuses) => {
      console.log('AdMob initialized successfully');
      return adapterStatuses;
    })
    .catch((error) => {
      console.warn('AdMob initialization error:', error);
      return {};
    });
};
