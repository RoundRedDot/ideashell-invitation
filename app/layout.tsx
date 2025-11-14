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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("https://ideashell.com"),
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
