import { BASE_PATH } from "@/lib/path-utils";

/**
 * Instant 404 Redirect
 *
 * Uses meta refresh for instant redirect without JavaScript.
 * This is the fastest possible redirect in static export mode.
 */
export default function NotFound() {
  // Build the redirect path - this will be evaluated at build time
  const redirectPath = BASE_PATH && BASE_PATH !== '/' ? BASE_PATH : '/';

  return (
    <>
      {/* Instant meta refresh - 0 second delay */}
      <meta httpEquiv="refresh" content={`0; url=${redirectPath}`} />

      {/* Fallback JavaScript redirect (in case meta refresh fails) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('${redirectPath}' + window.location.search);`,
        }}
      />
    </>
  );
}