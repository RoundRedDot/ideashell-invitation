'use client';

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { UAParser, UAInfo } from '@/lib/ua-parser';

/**
 * UserAgent Context Type
 */
interface UserAgentContextType {
  /**
   * Parsed User-Agent information
   */
  uaInfo: UAInfo | undefined;

  /**
   * Whether the User-Agent is from ideaShell WebView
   */
  isIdeaShell: boolean;

  /**
   * Whether the User-Agent is from WeChat WebView
   */
  isWeChat: boolean;

  /**
   * The platform detected from User-Agent
   */
  platform: 'ios' | 'android' | 'unknown';

  /**
   * Whether the device is mobile
   */
  isMobile: boolean;

  /**
   * ideaShell app version (if detected)
   */
  appVersion?: string;

  /**
   * ideaShell build number (if detected)
   */
  buildNumber?: string;

  /**
   * Network type from User-Agent
   */
  netType?: string;

  /**
   * Language from User-Agent
   */
  language?: string;

  /**
   * Raw User-Agent string
   */
  rawUA: string;
}

/**
 * UserAgent Context
 */
const UserAgentContext = createContext<UserAgentContextType | undefined>(undefined);

/**
 * UserAgent Provider Props
 */
interface UserAgentProviderProps {
  children: ReactNode;
  /**
   * Optional User-Agent string to use (useful for SSR)
   */
  userAgent?: string;
  /**
   * Optional fallback UA info (useful for testing)
   */
  fallbackUAInfo?: UAInfo;
}

/**
 * UserAgentProvider Component
 *
 * Provides User-Agent information to child components through React Context.
 * This avoids parsing the User-Agent string multiple times in different components.
 *
 * @param children - Child components
 * @param userAgent - Optional User-Agent string (useful for SSR)
 * @param fallbackUAInfo - Optional fallback UA info
 */
export function UserAgentProvider({
  children,
  userAgent,
  fallbackUAInfo,
}: UserAgentProviderProps) {
  // Parse User-Agent once and memoize the result
  const contextValue = useMemo<UserAgentContextType>(() => {
    let uaInfo: UAInfo | undefined = fallbackUAInfo;
    let rawUA = '';

    // Determine the User-Agent string to use
    if (userAgent) {
      rawUA = userAgent;
    } else if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      rawUA = navigator.userAgent;
    }

    // Parse the User-Agent if we have one
    if (rawUA && !fallbackUAInfo) {
      const parser = new UAParser();
      uaInfo = parser.parse(rawUA);
    }

    // Extract values from uaInfo
    const isIdeaShell = uaInfo?.isIdeaShell ?? false;
    const isWeChat = uaInfo?.isWeChat ?? false;
    const platform = uaInfo?.platform ?? 'unknown';
    const isMobile = platform === 'ios' || platform === 'android';

    return {
      uaInfo,
      isIdeaShell,
      isWeChat,
      platform,
      isMobile,
      appVersion: uaInfo?.appVersion,
      buildNumber: uaInfo?.buildNumber,
      netType: uaInfo?.netType,
      language: uaInfo?.language,
      rawUA: uaInfo?.rawUA ?? rawUA,
    };
  }, [userAgent, fallbackUAInfo]);

  return (
    <UserAgentContext.Provider value={contextValue}>
      {children}
    </UserAgentContext.Provider>
  );
}

/**
 * Hook to use UserAgent context
 *
 * @throws Error if used outside of UserAgentProvider
 * @returns UserAgent context value
 */
export function useUserAgentContext(): UserAgentContextType {
  const context = useContext(UserAgentContext);

  if (context === undefined) {
    throw new Error('useUserAgentContext must be used within a UserAgentProvider');
  }

  return context;
}

/**
 * Hook to check if running in ideaShell WebView (using context)
 *
 * @returns boolean indicating if running in ideaShell WebView
 */
export function useIsIdeaShell(): boolean {
  try {
    const { isIdeaShell } = useUserAgentContext();
    return isIdeaShell;
  } catch {
    // If context is not available, fall back to direct detection
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const parser = new UAParser();
      const uaInfo = parser.parse(navigator.userAgent);
      return uaInfo.isIdeaShell;
    }
    return false;
  }
}

/**
 * Hook to check if running in WeChat WebView (using context)
 *
 * @returns boolean indicating if running in WeChat WebView
 */
export function useIsWeChat(): boolean {
  try {
    const { isWeChat } = useUserAgentContext();
    return isWeChat;
  } catch {
    // If context is not available, fall back to direct detection
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const parser = new UAParser();
      const uaInfo = parser.parse(navigator.userAgent);
      return uaInfo.isWeChat;
    }
    return false;
  }
}

/**
 * Hook to get device platform (using context)
 *
 * @returns Platform type
 */
export function usePlatform(): 'ios' | 'android' | 'unknown' {
  try {
    const { platform } = useUserAgentContext();
    return platform;
  } catch {
    // If context is not available, fall back to direct detection
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const parser = new UAParser();
      const uaInfo = parser.parse(navigator.userAgent);
      return uaInfo.platform;
    }
    return 'unknown';
  }
}

/**
 * Hook to check if device is mobile (using context)
 *
 * @returns boolean indicating if device is mobile
 */
export function useIsMobile(): boolean {
  try {
    const { isMobile } = useUserAgentContext();
    return isMobile;
  } catch {
    // If context is not available, fall back to direct detection
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const parser = new UAParser();
      const uaInfo = parser.parse(navigator.userAgent);
      return uaInfo.platform === 'ios' || uaInfo.platform === 'android';
    }
    return false;
  }
}

/**
 * Hook to get ideaShell app information (using context)
 *
 * @returns Object with app version and build number
 */
export function useIdeaShellAppInfo(): {
  appVersion?: string;
  buildNumber?: string;
  isIdeaShell: boolean;
} {
  try {
    const { appVersion, buildNumber, isIdeaShell } = useUserAgentContext();
    return { appVersion, buildNumber, isIdeaShell };
  } catch {
    // If context is not available, fall back to direct detection
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const parser = new UAParser();
      const uaInfo = parser.parse(navigator.userAgent);
      return {
        appVersion: uaInfo.appVersion,
        buildNumber: uaInfo.buildNumber,
        isIdeaShell: uaInfo.isIdeaShell,
      };
    }
    return { isIdeaShell: false };
  }
}

/**
 * Higher-Order Component to inject UserAgent info as props
 *
 * @param Component - Component to wrap
 * @returns Wrapped component with UserAgent props
 */
export function withUserAgent<P extends object>(
  Component: React.ComponentType<P & UserAgentContextType>
): React.ComponentType<P> {
  return function WithUserAgentComponent(props: P) {
    const uaContext = useUserAgentContext();
    return <Component {...props} {...uaContext} />;
  };
}