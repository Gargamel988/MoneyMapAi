import mobileAds from 'react-native-google-mobile-ads';

export const initAds = () => {
  return mobileAds()
    .initialize()
    .then(adapterStatuses => {
      console.log("AdMob SDK Initialized");
      return adapterStatuses;
    });
};
