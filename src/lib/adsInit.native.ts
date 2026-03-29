import mobileAds from "react-native-google-mobile-ads";

export const initAds = () => {
  return mobileAds()
    .initialize()
    .then((adapterStatuses) => {
      return adapterStatuses;
    })
    .catch((error) => {
      throw error;
    });
};
