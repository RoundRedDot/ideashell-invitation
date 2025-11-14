"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

interface ConditionalWrapperProps {
  children: ReactNode;
}

export function ConditionalWrapper({ children }: ConditionalWrapperProps) {
  const searchParams = useSearchParams();
  const isWebview = searchParams.get("webview") === "true";

  if (isWebview) {
    return null;
  }

  return <>{children}</>;
}