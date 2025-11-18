/**
 * Platform detection utilities
 * Provides functions to detect user's platform and browser environment
 */

export type Platform = 'ios' | 'android' | 'desktop' | 'unknown';

export interface PlatformInfo {
  platform: Platform;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  userAgent: string;
}

/**
 * Detects the current platform based on User-Agent
 */
export function detectPlatform(): PlatformInfo {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isMobile = isIOS || isAndroid;
  const isDesktop = !isMobile;

  let platform: Platform = 'unknown';
  if (isIOS) {
    platform = 'ios';
  } else if (isAndroid) {
    platform = 'android';
  } else if (isDesktop) {
    platform = 'desktop';
  }

  return {
    platform,
    isIOS,
    isAndroid,
    isMobile,
    isDesktop,
    userAgent
  };
}

/**
 * Checks if the app is running inside ideaShell WebView
 */
export function isInIdeaShellWebView(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /ideaShell/i.test(navigator.userAgent);
}

/**
 * Gets the appropriate app store URL based on platform
 */
export function getStoreUrl(platform: Platform): string {
  const iosStoreUrl = process.env.NEXT_PUBLIC_APP_IOS_STORE_URL || '';
  const androidStoreUrl = process.env.NEXT_PUBLIC_APP_ANDROID_STORE_URL || '';

  switch (platform) {
    case 'ios':
      return iosStoreUrl;
    case 'android':
      return androidStoreUrl;
    case 'desktop':
      // On desktop, we could show both options or detect OS
      // For now, return empty string to handle in UI
      return '';
    default:
      return '';
  }
}

/**
 * Gets platform-specific timeout for app launch detection
 * iOS needs longer timeout due to system behavior
 */
export function getPlatformTimeout(platform: Platform): number {
  switch (platform) {
    case 'ios':
      return 2600; // 2.6 seconds for iOS
    case 'android':
      return 1300; // 1.3 seconds for Android
    default:
      return 2000; // Default 2 seconds
  }
}

/**
 * Gets platform-specific blur threshold for detecting app switch
 */
export function getBlurThreshold(platform: Platform): number {
  switch (platform) {
    case 'ios':
      return 2200; // 2.2 seconds for iOS
    case 'android':
      return 1400; // 1.4 seconds for Android
    default:
      return 2000; // Default 2 seconds
  }
}