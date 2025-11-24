import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var ua = window.navigator.userAgent;
                  var docEl = document.documentElement;
                  var isWebview = ua.indexOf('ideaShell') > -1;
                  var isIos = /iPhone|iPad|iPod/i.test(ua);
                  
                  if (!isWebview && !isIos) return;

                  function setAttributes() {
                    if (isWebview && !docEl.hasAttribute('data-webview')) {
                      docEl.setAttribute('data-webview', 'true');
                    }
                    if (isIos && !docEl.hasAttribute('data-ios')) {
                      docEl.setAttribute('data-ios', 'true');
                    }
                  }

                  setAttributes();

                  var observer = new MutationObserver(function(mutations) {
                    setAttributes();
                  });

                  observer.observe(docEl, { 
                    attributes: true, 
                    subtree: false, 
                    childList: false 
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ideashell.com"),
  icons: {
    icon: [
      {
        url: "https://framerusercontent.com/images/fcJjbB23H0sLVZrHJjtxMV2aP4g.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "https://framerusercontent.com/images/fcJjbB23H0sLVZrHJjtxMV2aP4g.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "https://framerusercontent.com/images/LVWyojf25qaf4cNwCGXerPi8wg.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F4F4" },
    { media: "(prefers-color-scheme: dark)", color: "#1E1E1E" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};
