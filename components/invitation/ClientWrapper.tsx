"use client";

import { useSearchParams } from "next/navigation";
import { AppDownloadHeader } from "./AppDownloadHeader";
import { InvitationCard } from "./InvitationCard";

export function ClientWrapper() {
  const searchParams = useSearchParams();
  const isWebview = searchParams.get("webview") === "true";

  if (isWebview) {
    return null;
  }

  return (
    <>
      <AppDownloadHeader />
    </>
  );
}

export function InvitationCardWrapper() {
  const searchParams = useSearchParams();
  const isWebview = searchParams.get("webview") === "true";

  if (isWebview) {
    return null;
  }

  return <InvitationCard />;
}