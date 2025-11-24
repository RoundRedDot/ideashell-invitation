'use client';

import { useState, useEffect } from 'react';
import { UAParser, UAInfo } from '@/lib/ua-parser';

/**
 * Custom hook for User-Agent detection with SSR support
 *
 * @param userAgentString - Optional User-Agent string to parse (useful for SSR)
 * @returns UAInfo object with parsed User-Agent information
 */
export function useUserAgent(userAgentString?: string): UAInfo | undefined {
  const [uaInfo, setUAInfo] = useState<UAInfo | undefined>(() => {
    // If a User-Agent string is provided (e.g., from SSR), parse it immediately
    if (userAgentString) {
      const parser = new UAParser();
      return parser.parse(userAgentString);
    }

    // Otherwise, check if we're on the client side
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const parser = new UAParser();
      return parser.parse(navigator.userAgent);
    }

    return undefined;
  });

  useEffect(() => {
    // Only run on client side and if no userAgentString was provided
    if (!userAgentString && typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const parser = new UAParser();
      const info = parser.parse(navigator.userAgent);
      setUAInfo(info);
    }
  }, [userAgentString]);

  return uaInfo;
}

/**
 * Hook specifically for detecting ideaShell WebView
 *
 * @param userAgentString - Optional User-Agent string to parse
 * @returns Object with WebView detection status and UA info
 */
export function useIdeaShellDetection(userAgentString?: string): {
  isCN: boolean;
  isIdeaShell: boolean;
  isLoading: boolean;
  uaInfo?: UAInfo;
} {
  const [isLoading, setIsLoading] = useState(true);
  const uaInfo = useUserAgent(userAgentString);

  useEffect(() => {
    if (uaInfo !== undefined) {
      setIsLoading(false);
    }
  }, [uaInfo]);

  return {
    isCN: uaInfo?.isCN ?? false,
    isIdeaShell: uaInfo?.isIdeaShell ?? false,
    isLoading,
    uaInfo,
  };
}

/**
 * Hook for getting device information
 *
 * @returns Device information extracted from User-Agent
 */
export function useDeviceInfo(): {
  platform: 'ios' | 'android' | 'unknown';
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  deviceModel?: string;
  osVersion?: string;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(true);
  const uaInfo = useUserAgent();

  useEffect(() => {
    if (uaInfo !== undefined) {
      setIsLoading(false);
    }
  }, [uaInfo]);

  const isMobile = uaInfo ? ['ios', 'android'].includes(uaInfo.platform) : false;

  return {
    platform: uaInfo?.platform ?? 'unknown',
    isMobile,
    isIOS: uaInfo?.platform === 'ios',
    isAndroid: uaInfo?.platform === 'android',
    deviceModel: uaInfo?.deviceModel,
    osVersion: uaInfo?.iosVersion ?? uaInfo?.androidVersion,
    isLoading,
  };
}

/**
 * Hook for getting network information
 *
 * @returns Network information from User-Agent
 */
export function useNetworkInfo(): {
  netType?: string;
  language?: string;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(true);
  const uaInfo = useUserAgent();

  useEffect(() => {
    if (uaInfo !== undefined) {
      setIsLoading(false);
    }
  }, [uaInfo]);

  return {
    netType: uaInfo?.netType,
    language: uaInfo?.language,
    isLoading,
  };
}

/**
 * Hook for getting ideaShell app information
 *
 * @returns ideaShell app version and build information
 */
export function useIdeaShellInfo(): {
  appVersion?: string;
  buildNumber?: string;
  isIdeaShell: boolean;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(true);
  const uaInfo = useUserAgent();

  useEffect(() => {
    if (uaInfo !== undefined) {
      setIsLoading(false);
    }
  }, [uaInfo]);

  return {
    appVersion: uaInfo?.appVersion,
    buildNumber: uaInfo?.buildNumber,
    isIdeaShell: uaInfo?.isIdeaShell ?? false,
    isLoading,
  };
}