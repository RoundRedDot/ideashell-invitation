"use client";

import { useEffect } from "react";
import { getPreferredLocale } from "@/lib/locale-detector";
import { getLocalePath } from "@/lib/path-utils";

export default function RootRedirect() {
  useEffect(() => {
    try {
      const { search } = window.location;
      const qs = search || "";

      // Use the new locale detector that prioritizes User-Agent language
      // This will check:
      // 1. User-Agent Language header (ideaShell app)
      // 2. navigator.languages (browser preference)
      // 3. Default to 'en'
      const preferredLocale = getPreferredLocale();

      const targetPath = getLocalePath(preferredLocale);

      window.location.replace(`${targetPath}${qs}`);
    } catch (e) {
      const fallbackPath = getLocalePath('en');
      window.location.replace(`${fallbackPath}${window.location.search || ""}`);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ff4d23] border-r-transparent"></div>
        <p className="mt-4 text-sm text-[#1e1e1e]">Loading...</p>
      </div>
    </div>
  );
}
