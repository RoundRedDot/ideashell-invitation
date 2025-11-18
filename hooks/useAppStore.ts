'use client';

/**
 * useAppStore Hook
 * Provides direct app store opening functionality
 */

import { useCallback, useState } from 'react';
import { openStore as openStoreCore } from '@/lib/app-launcher';
import { detectPlatform, Platform } from '@/lib/app-launcher';

export interface UseAppStoreOptions {
  customStoreUrl?: string;
  onOpen?: (platform: Platform) => void;
  onError?: (error: Error) => void;
}

export interface UseAppStoreReturn {
  openStore: () => void;
  platform: Platform;
  storeUrl: string;
  isAvailable: boolean;
}

/**
 * Custom hook for opening app store directly
 */
export function useAppStore(options: UseAppStoreOptions = {}): UseAppStoreReturn {
  const [platform] = useState(() => detectPlatform().platform);

  const getStoreUrl = useCallback(() => {
    if (options.customStoreUrl) {
      return options.customStoreUrl;
    }

    switch (platform) {
      case 'ios':
        return process.env.NEXT_PUBLIC_APP_IOS_STORE_URL || '';
      case 'android':
        return process.env.NEXT_PUBLIC_APP_ANDROID_STORE_URL || '';
      default:
        return '';
    }
  }, [platform, options.customStoreUrl]);

  const storeUrl = getStoreUrl();
  const isAvailable = Boolean(storeUrl);

  const openStore = useCallback(() => {
    try {
      if (!isAvailable) {
        throw new Error(`No store URL available for platform: ${platform}`);
      }

      openStoreCore(options.customStoreUrl);
      options.onOpen?.(platform);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to open store');
      console.error('Failed to open app store:', error);
      options.onError?.(error);
    }
  }, [isAvailable, platform, options]);

  return {
    openStore,
    platform,
    storeUrl,
    isAvailable
  };
}