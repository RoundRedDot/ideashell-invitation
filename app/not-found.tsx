"use client";

import { useEffect } from "react";
import { looksLikeLocale, mapPathToLocale } from "@/lib/locale-detector";
import { BASE_PATH, getLocalePath } from "@/lib/path-utils";

/**
 * Not Found Handler with Intelligent Locale Fallback
 *
 * Handles 404 errors with smart redirection for invalid locale paths.
 * When an unsupported locale is accessed (e.g., /zh-Hant, /pt-PT),
 * it tries to map to a supported locale or redirects to base path
 * for automatic language detection.
 */
export default function NotFound() {
  useEffect(() => {
    // Get the current pathname
    const pathname = window.location.pathname;

    // Remove base path if present to get the clean path
    const cleanPath = BASE_PATH && BASE_PATH !== '/' && pathname.startsWith(BASE_PATH)
      ? pathname.slice(BASE_PATH.length)
      : pathname;

    // Extract the first segment (potential locale)
    const segments = cleanPath.split('/').filter(Boolean);
    const potentialLocale = segments[0];

    // Check if this looks like a locale path
    if (potentialLocale && looksLikeLocale(potentialLocale)) {
      console.log(`[404] Detected locale-like path: ${potentialLocale}`);

      // Try to map to a supported locale
      const mappedLocale = mapPathToLocale(potentialLocale);

      if (mappedLocale) {
        // We found a mapping! Redirect to the mapped locale
        console.log(`[404] Mapping ${potentialLocale} -> ${mappedLocale}`);

        // Preserve the rest of the path and query parameters
        const restOfPath = segments.slice(1).join('/');
        const queryString = window.location.search;

        // Build the new path with the mapped locale
        const newPath = getLocalePath(mappedLocale) +
          (restOfPath ? `/${restOfPath}` : '') +
          queryString;

        // Redirect to the mapped locale
        window.location.replace(newPath);
        return;
      } else {
        // No mapping found, redirect to base for auto-detection
        console.log(`[404] No mapping for ${potentialLocale}, redirecting to base path for language detection`);

        // Preserve query parameters
        const queryString = window.location.search;

        // Redirect to base path for automatic language detection
        const redirectPath = BASE_PATH && BASE_PATH !== '/' ? BASE_PATH : '/';

        // Use replace to avoid adding to history
        window.location.replace(`${redirectPath}${queryString}`);
        return;
      }
    }

    // For non-locale 404s, optionally redirect to home after a delay
    // This helps users who land on truly broken links
    console.log(`[404] Non-locale path: ${cleanPath}`);

    // Optional: Auto-redirect to home after 5 seconds for non-locale 404s
    setTimeout(() => {
      const redirectPath = BASE_PATH && BASE_PATH !== '/' ? BASE_PATH : '/';
      console.log(`[404] Auto-redirecting to home: ${redirectPath}`);
      window.location.replace(redirectPath);
    }, 5000);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Loading spinner while checking/redirecting */}
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ff4d23] border-r-transparent mb-4"></div>

        <p className="text-sm text-gray-400">
          Checking language settings...
        </p>

        <p className="text-xs text-gray-400 mt-4">
          You will be redirected to the home page in a few seconds.
        </p>
      </div>
    </div>
  );
}