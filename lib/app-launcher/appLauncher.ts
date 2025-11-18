/**
 * App launcher core module
 * Provides functions to launch app and handle fallback to app store
 */

import { detectPlatform, getStoreUrl, getPlatformTimeout, getBlurThreshold } from './platformDetector';

export interface AppLauncherConfig {
  deepLink?: string;
  onSuccess?: () => void;
  onFallback?: () => void;
  onError?: (error: Error) => void;
  customTimeout?: number;
  customStoreUrl?: string;
}

export interface LaunchResult {
  success: boolean;
  method: 'app' | 'store' | 'none';
  error?: Error;
}

/**
 * Attempts to launch the app using deep link
 */
export function launchApp(deepLink: string): void {
  if (!deepLink) {
    throw new Error('Deep link is required');
  }

  // Use location.href to trigger deep link
  // This method works across most browsers
  window.location.href = deepLink;
}

/**
 * Opens the app store based on current platform
 */
export function openStore(customStoreUrl?: string): void {
  const platformInfo = detectPlatform();
  const storeUrl = customStoreUrl || getStoreUrl(platformInfo.platform);

  if (!storeUrl) {
    console.warn(`No store URL available for platform: ${platformInfo.platform}`);
    return;
  }

  window.location.href = storeUrl;
}

/**
 * Launches app with intelligent fallback to store
 * This is the main function that handles the complete flow
 */
export function launchAppWithFallback(config: AppLauncherConfig): Promise<LaunchResult> {
  return new Promise((resolve) => {
    const {
      deepLink,
      onSuccess,
      onFallback,
      onError,
      customTimeout,
      customStoreUrl
    } = config;

    // Get platform info
    const platformInfo = detectPlatform();
    const storeUrl = customStoreUrl || getStoreUrl(platformInfo.platform);

    // Early return if no deep link
    if (!deepLink) {
      const error = new Error('Deep link is required');
      onError?.(error);
      resolve({ success: false, method: 'none', error });
      return;
    }

    // If no store URL available, just launch app without fallback
    if (!storeUrl) {
      try {
        launchApp(deepLink);
        onSuccess?.();
        resolve({ success: true, method: 'app' });
      } catch (error) {
        const err = error as Error;
        onError?.(err);
        resolve({ success: false, method: 'none', error: err });
      }
      return;
    }

    // Setup launch detection with fallback
    let didLaunchApp = false;
    let hasRedirectedToStore = false; // Prevent double redirect
    let blurTimestamp = 0;
    let fallbackTimer: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };

    const redirectToStore = () => {
      // Prevent multiple redirects
      if (hasRedirectedToStore || didLaunchApp) {
        return;
      }
      hasRedirectedToStore = true;
      window.location.href = storeUrl;
      onFallback?.();
      resolve({ success: true, method: 'store' });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        didLaunchApp = true;
        cleanup();
        onSuccess?.();
        resolve({ success: true, method: 'app' });
      }
    };

    const handleBlur = () => {
      blurTimestamp = Date.now();
      // Clear the timer when blur occurs (potential app switch)
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
    };

    const handleFocus = () => {
      if (!didLaunchApp && blurTimestamp) {
        const elapsed = Date.now() - blurTimestamp;
        const threshold = getBlurThreshold(platformInfo.platform);

        if (elapsed > threshold) {
          // App was likely launched successfully
          didLaunchApp = true;
          cleanup();
          onSuccess?.();
          resolve({ success: true, method: 'app' });
        } else if (!hasRedirectedToStore) {
          // User returned quickly, likely app launch failed
          // Restart the timer with remaining time consideration
          const timeout = customTimeout || getPlatformTimeout(platformInfo.platform);
          const remainingTime = Math.max(timeout - elapsed, 500); // At least 500ms

          fallbackTimer = setTimeout(() => {
            if (!didLaunchApp && document.visibilityState === 'visible') {
              cleanup();
              redirectToStore();
            }
          }, remainingTime);
        }
      }
    };

    const startFallbackTimer = () => {
      const timeout = customTimeout || getPlatformTimeout(platformInfo.platform);

      fallbackTimer = setTimeout(() => {
        if (!didLaunchApp && !hasRedirectedToStore && document.visibilityState === 'visible') {
          cleanup();
          redirectToStore();
        }
      }, timeout);
    };

    // Register event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
    window.addEventListener('pagehide', handleVisibilityChange, false);
    window.addEventListener('blur', handleBlur, false);
    window.addEventListener('focus', handleFocus, false);

    // Start the fallback timer
    startFallbackTimer();

    // Attempt to launch the app
    try {
      launchApp(deepLink);
    } catch (error) {
      cleanup();
      const err = error as Error;
      onError?.(err);
      resolve({ success: false, method: 'none', error: err });
    }
  });
}

/**
 * Builds a deep link URL with query parameters
 */
export function buildDeepLink(baseUrl: string, params: Record<string, string>): string {
  if (!baseUrl) return '';

  try {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    // Fallback for non-standard URL schemes
    const separator = baseUrl.includes('?') ? '&' : '?';
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return `${baseUrl}${separator}${queryString}`;
  }
}