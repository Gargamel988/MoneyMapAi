import React from 'react';

export const BannerAd = ({ unitId, size, requestOptions, onAdLoaded, onAdFailedToLoad }: any) => {
  console.log('BannerAd Mock Rendered', { unitId, size });
  return null;
};

export const BannerAdSize = {
  BANNER: 'BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  FULL_BANNER: 'FULL_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  INLINE_ADAPTIVE_BANNER: 'INLINE_ADAPTIVE_BANNER',
  WIDE_SKYSCRAPER: 'WIDE_SKYSCRAPER',
};

export const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  ADAPTIVE_BANNER: 'ca-app-pub-3940256099942544/9214589741',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
};

const createMockAd = () => ({
  load: () => {},
  show: () => Promise.resolve(),
  addAdEventListener: (type: string, handler: any) => () => {},
  loaded: false,
});

export const InterstitialAd = {
  createForAdRequest: (adUnitId: string, options?: any) => createMockAd(),
};

export const RewardedAd = {
  createForAdRequest: (adUnitId: string, options?: any) => createMockAd(),
};

export const AdEventType = {
  LOADED: 'loaded',
  OPENED: 'opened',
  CLOSED: 'closed',
  ERROR: 'error',
};

export const RewardedAdEventType = {
  LOADED: 'loaded',
  EARNED_REWARD: 'earned_reward',
  ERROR: 'error',
};
