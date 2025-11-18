"use client";

import { ReactNode } from "react";
import { useDeviceInfo, useIdeaShellDetection } from "@/hooks/useUserAgent";

interface ConditionalWrapperProps {
  children: ReactNode;
  forceWebView?: boolean;
  forceShow?: boolean;
}

export function ConditionalWrapper({ children, forceWebView = false, forceShow = false }: ConditionalWrapperProps) {
  const { isIdeaShell, isLoading } = useIdeaShellDetection();
  const { isIOS } = useDeviceInfo();

  // Force show overrides everything
  if (forceShow) {
    return <>{children}</>;
  }

  // Force WebView mode
  if (forceWebView) {
    return null;
  }

  // In IdeaShell app: iOS needs top spacing, other platforms don't render
  if (!isLoading && isIdeaShell) {
    return isIOS ? <div className="pt-10"></div> : null;
  }

  return <>{children}</>;
}
