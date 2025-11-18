'use client';

/**
 * useAppLauncher Hook
 * Provides app launching functionality with fallback to app store
 */

import { useState, useCallback } from 'react';
import { launchAppWithFallback, buildDeepLink, AppLauncherConfig, LaunchResult } from '@/lib/app-launcher';

export interface UseAppLauncherOptions {
  deepLink?: string;
  deepLinkParams?: Record<string, string>;
  onSuccess?: () => void;
  onFallback?: () => void;
  onError?: (error: Error) => void;
  customTimeout?: number;
  customStoreUrl?: string;
}

export interface UseAppLauncherReturn {
  launch: () => Promise<void>;
  isLaunching: boolean;
  error: Error | null;
  lastResult: LaunchResult | null;
}

/**
 * Custom hook for launching app with intelligent fallback
 */
export function useAppLauncher(options: UseAppLauncherOptions = {}): UseAppLauncherReturn {
  const [isLaunching, setIsLaunching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<LaunchResult | null>(null);

  const launch = useCallback(async () => {
    // Reset state
    setIsLaunching(true);
    setError(null);

    try {
      // Build deep link if params provided
      let finalDeepLink = options.deepLink || process.env.NEXT_PUBLIC_APP_DEEPLINK_URL || '';

      if (options.deepLinkParams && finalDeepLink) {
        finalDeepLink = buildDeepLink(finalDeepLink, options.deepLinkParams);
      }

      const config: AppLauncherConfig = {
        deepLink: finalDeepLink,
        onSuccess: options.onSuccess,
        onFallback: options.onFallback,
        onError: (err) => {
          setError(err);
          options.onError?.(err);
        },
        customTimeout: options.customTimeout,
        customStoreUrl: options.customStoreUrl
      };

      const result = await launchAppWithFallback(config);
      setLastResult(result);

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to launch app');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLaunching(false);
    }
  }, [options]);

  return {
    launch,
    isLaunching,
    error,
    lastResult
  };
}