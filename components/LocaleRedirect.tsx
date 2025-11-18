"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLocalePath } from "@/lib/path-utils";
import { Locale } from "@/i18n/config";

interface LocaleRedirectProps {
  from: string;
  to: Locale;
}

/**
 * Client-side locale redirect component
 * Used to redirect locale variants to canonical locales
 */
export function LocaleRedirect({ from, to }: LocaleRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the redirect for debugging
    console.log(`[LocaleRedirect] Redirecting from /${from} to ${getLocalePath(to)}`);

    // Preserve query parameters
    const queryString = window.location.search;
    const targetPath = getLocalePath(to) + queryString;

    // Use replace to avoid adding to history
    router.replace(targetPath);
  }, [from, to, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ff4d23] border-r-transparent mb-4"></div>
        <p className="text-sm text-gray-500">
          Redirecting to your language preference...
        </p>
      </div>
    </div>
  );
}