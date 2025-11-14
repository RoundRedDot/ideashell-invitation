"use client";

import { useEffect } from "react";

// Fallback client-side locale redirect for static hosting.
// Nginx should handle '/' -> '/en' (or '/zh-CN'), this is a safety net.
export default function RootRedirect() {
  useEffect(() => {
    try {
      const { search } = window.location;
      const qs = search || "";
      const langs = typeof navigator !== "undefined" ? navigator.languages || [navigator.language] : [];
      const preferZh = langs.some((l) => l && l.toLowerCase().startsWith("zh"));
      const target = preferZh ? "/zh-CN" : "/en";
      window.location.replace(`${target}${qs}`);
    } catch (e) {
      window.location.replace(`/en${window.location.search || ""}`);
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
