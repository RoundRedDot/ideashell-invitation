'use client';

/**
 * AppDownloadButton Component
 * Client-side button component for app download/launch functionality
 */

import { useAppLauncher } from '@/hooks/useAppLauncher';
import { useCallback } from 'react';
import { useWeChatOverlay } from '@/hooks/useWeChatOverlay';

interface AppDownloadButtonProps {
  children: React.ReactNode;
  className?: string;
  deepLinkParams?: Record<string, string>;
  onLaunch?: () => void;
  onSuccess?: () => void;
  onFallback?: () => void;
}

export function AppDownloadButton({
  children,
  className,
  deepLinkParams,
  onLaunch,
  onSuccess,
  onFallback
}: AppDownloadButtonProps) {
  const { checkWeChat, WeChatOverlay } = useWeChatOverlay();

  const { launch, isLaunching } = useAppLauncher({
    deepLinkParams,
    onSuccess: () => {
      console.log('App launched successfully');
      onSuccess?.();
    },
    onFallback: () => {
      console.log('Redirected to app store');
      onFallback?.();
    }
  });

  const handleClick = useCallback(() => {
    if (checkWeChat()) {
      return;
    }

    onLaunch?.();
    launch();
  }, [launch, onLaunch, checkWeChat]);

  return (
    <>
      <button
        className={className}
        onClick={handleClick}
        disabled={isLaunching}
        aria-label="Download or open ideaShell app"
      >
        {children}
      </button>

      <WeChatOverlay />
    </>
  );
}
