'use client';

/**
 * AppDownloadButton Component
 * Client-side button component for app download/launch functionality
 */

import { useAppLauncher } from '@/hooks/useAppLauncher';
import { useCallback } from 'react';

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
    onLaunch?.();
    launch();
  }, [launch, onLaunch]);

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={isLaunching}
      aria-label="Download or open ideaShell app"
    >
      {children}
    </button>
  );
}