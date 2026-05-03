import mobileAds, {
  BannerAd as RealBannerAd,
  BannerAdSize,
  InterstitialAd as RealInterstitialAd,
  RewardedAd as RealRewardedAd,
  TestIds,
  AdEventType,
  RewardedAdEventType
} from 'react-native-google-mobile-ads';
import Constants from 'expo-constants';
import React from 'react';


// Expo Go için Mock Bileşenler
const MockBannerAd = () => null;

const createMockAd = () => ({
  load: () => { },
  show: () => Promise.resolve(),
  addAdEventListener: (type: string, handler: any) => () => { },
  loaded: false,
});

const MockInterstitialAd = {
  createForAdRequest: () => createMockAd(),
};

const MockRewardedAd = {
  createForAdRequest: () => createMockAd(),
};

const isExpoGo = Constants.appOwnership === 'expo';

export const BannerAd = isExpoGo ? MockBannerAd : RealBannerAd;
export const InterstitialAd = isExpoGo ? MockInterstitialAd : RealInterstitialAd;
export const RewardedAd = isExpoGo ? MockRewardedAd : RealRewardedAd;

export {
  BannerAdSize,
  TestIds,
  AdEventType,
  RewardedAdEventType
};
