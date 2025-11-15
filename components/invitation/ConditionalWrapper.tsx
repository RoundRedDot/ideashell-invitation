"use client";

import { ReactNode } from "react";
import { useIdeaShellDetection } from "@/hooks/useUserAgent";

interface ConditionalWrapperProps {
  children: ReactNode;
  forceWebView?: boolean;
  forceShow?: boolean;
}

export function ConditionalWrapper({
  children,
  forceWebView = false,
  forceShow = false
}: ConditionalWrapperProps) {
  const { isIdeaShell, isLoading } = useIdeaShellDetection();

  // Force show overrides everything
  if (forceShow) {
    return <>{children}</>;
  }

  // Force WebView mode
  if (forceWebView) {
    return null;
  }

  if (!isLoading && isIdeaShell) {
    return null;
  }

  return <>{children}</>;
}