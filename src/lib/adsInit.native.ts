import mobileAds from "react-native-google-mobile-ads";
import Constants from "expo-constants";

export const initAds = () => {
  // Expo Go'da reklamları başlatma (çökmeyi önler)
  if (Constants.appOwnership === 'expo') {

    return Promise.resolve({});
  }

  return mobileAds()
    .initialize()
    .then((adapterStatuses) => {

      return adapterStatuses;
    })
    .catch((error) => {
      console.warn('AdMob initialization error:', error);
      return {};
    });
};
