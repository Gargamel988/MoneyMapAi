import React from 'react';

export const BannerAd = () => null;
export const InterstitialAd = {
  createForAdRequest: () => ({
    load: () => {},
    show: () => Promise.resolve(),
    addAdEventListener: () => () => {},
    loaded: false,
  }),
};
export const RewardedAd = {
  createForAdRequest: () => ({
    load: () => {},
    show: () => Promise.resolve(),
    addAdEventListener: () => () => {},
    loaded: false,
  }),
};

export const BannerAdSize = {
  BANNER: 'BANNER',
  FULL_BANNER: 'FULL_BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  LEADERBOARD: 'LEADERBOARD',
  ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  INLINE_ADAPTIVE_BANNER: 'INLINE_ADAPTIVE_BANNER',
  WIDE_SKYSCRAPER: 'WIDE_SKYSCRAPER',
};

export const TestIds = {
  BANNER: 'mock',
  ADAPTIVE_BANNER: 'mock',
  INTERSTITIAL: 'mock',
  REWARDED: 'mock',
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

