"use client";

import { ReactNode } from "react";
import { useDeviceInfo, useIdeaShellDetection } from "@/hooks/useUserAgent";

interface ConditionalWrapperProps {
  children: ReactNode;
  forceWebView?: boolean;
  forceShow?: boolean;
  headerSide?: boolean;
}

export function ConditionalWrapper({ children, forceWebView = false, forceShow = false, headerSide = false }: ConditionalWrapperProps) {
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
    return isIOS && headerSide ? <div style={{ marginTop: "calc(env(safe-area-inset-top) - 16px)" }}></div> : null;
  }

  return <>{children}</>;
}
