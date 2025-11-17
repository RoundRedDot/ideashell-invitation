/**
 * Path utilities for handling subpath deployment
 *
 * This module provides centralized path handling for deployment at subpaths (e.g., /user/invite/)
 * while maintaining compatibility with root path deployment during development.
 */

/**
 * The base path for the application deployment
 * Can be configured via NEXT_PUBLIC_BASE_PATH environment variable
 * Defaults to '/user/invite' for production deployment
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/user/invite';

/**
 * Check if we're running with a base path
 */
export const HAS_BASE_PATH = BASE_PATH && BASE_PATH !== '/';

/**
 * Get the full path including the base path
 * Used for window.location operations
 * @param path - The path relative to the application root
 * @returns The full path including the base path
 */
export function getFullPath(path: string): string {
  // Handle empty path
  if (!path) return BASE_PATH;

  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If no base path or base path is root, return the clean path
  if (!HAS_BASE_PATH) {
    return cleanPath;
  }

  // Combine base path with the clean path
  return `${BASE_PATH}${cleanPath}`;
}

/**
 * Get the locale-specific path for window.location operations
 * @param locale - The locale code (e.g., 'en', 'zh-CN')
 * @returns The full path for the locale including base path
 */
export function getLocalePath(locale: string): string {
  return getFullPath(`/${locale}`);
}

/**
 * Get the locale-specific path for Next.js router navigation
 * Next.js router automatically handles the base path, so we don't include it
 * @param locale - The locale code (e.g., 'en', 'zh-CN')
 * @returns The path for the locale without base path
 */
export function getLocalePathForRouter(locale: string): string {
  return `/${locale}`;
}

/**
 * Extract the locale from a pathname
 * @param pathname - The pathname from usePathname (without base path)
 * @returns The locale code or 'en' as default
 */
export function extractLocaleFromPath(pathname: string): string {
  // usePathname returns path without base path
  // So we work with the clean pathname directly
  const segments = pathname.split('/').filter(Boolean);

  // First segment should be the locale
  return segments[0] || 'en';
}

/**
 * Replace the locale in a pathname for Next.js router navigation
 * @param pathname - The current pathname from usePathname (without base path)
 * @param newLocale - The new locale to set
 * @returns The pathname with the new locale (without base path for router)
 */
export function replaceLocaleInPath(pathname: string, newLocale: string): string {
  // usePathname returns path without base path
  // Split path into segments
  const segments = pathname.split('/').filter(Boolean);

  // Replace the first segment (locale)
  if (segments.length > 0) {
    segments[0] = newLocale;
  } else {
    segments.push(newLocale);
  }

  // Return path without base path (router adds it automatically)
  return '/' + segments.join('/');
}

/**
 * Replace the locale in a pathname for window.location operations
 * @param pathname - The current full pathname
 * @param newLocale - The new locale to set
 * @returns The pathname with the new locale including base path
 */
export function replaceLocaleInFullPath(pathname: string, newLocale: string): string {
  // Remove base path if present
  let pathWithoutBase = pathname;
  if (HAS_BASE_PATH && pathname.startsWith(BASE_PATH)) {
    pathWithoutBase = pathname.slice(BASE_PATH.length);
  }

  // Split path into segments
  const segments = pathWithoutBase.split('/').filter(Boolean);

  // Replace the first segment (locale)
  if (segments.length > 0) {
    segments[0] = newLocale;
  } else {
    segments.push(newLocale);
  }

  // Reconstruct the path with base
  return getFullPath(segments.join('/'));
}

/**
 * Get the asset path with base path
 * @param assetPath - The asset path relative to public folder
 * @returns The full asset path including base path
 */
export function getAssetPath(assetPath: string): string {
  // Ensure asset path starts with /
  const cleanPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;

  // If no base path, return the clean path
  if (!HAS_BASE_PATH) {
    return cleanPath;
  }

  // Combine base path with asset path
  return `${BASE_PATH}${cleanPath}`;
}

/**
 * Get the canonical URL for a given path
 * @param path - The path relative to the application
 * @param siteUrl - The base site URL (optional, uses env var if not provided)
 * @returns The full canonical URL
 */
export function getCanonicalUrl(path: string, siteUrl?: string): string {
  const baseUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://ideashell.com';

  // Remove trailing slash from base URL
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  // Get full path with base
  const fullPath = getFullPath(path);

  return `${cleanBaseUrl}${fullPath}`;
}

/**
 * Check if a path is the root of a locale
 * @param pathname - The pathname to check (from usePathname, without base path)
 * @param locale - The locale to check against
 * @returns True if the path is the locale root
 */
export function isLocaleRoot(pathname: string, locale: string): boolean {
  // Remove trailing slash for comparison
  const cleanPathname = pathname.replace(/\/$/, '');
  const cleanLocalePath = `/${locale}`;

  return cleanPathname === cleanLocalePath;
}

/**
 * Strip the base path from a pathname
 * @param pathname - The full pathname
 * @returns The pathname without base path
 */
export function stripBasePath(pathname: string): string {
  if (!HAS_BASE_PATH) {
    return pathname;
  }

  if (pathname.startsWith(BASE_PATH)) {
    return pathname.slice(BASE_PATH.length) || '/';
  }

  return pathname;
}

/**
 * Get all locale paths for language alternates in metadata
 * Returns paths WITH base path for metadata generation
 * @param locales - Array of locale codes
 * @returns Object mapping locale codes to their full paths
 */
export function getAllLocalePaths(locales: readonly string[]): Record<string, string> {
  const paths: Record<string, string> = {};

  for (const locale of locales) {
    paths[locale] = getLocalePath(locale);
  }

  return paths;
}