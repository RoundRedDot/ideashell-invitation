import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "ideaShell - AI Voice Notes for Everything That Matters",
  description: "Join ideaShell and receive 100,000 AI Credits! The #1 AI voice notes app with 10,000+ 5-star reviews. Perfect for meetings, ideas, journals, studying, and thoughts.",
  keywords: "AI voice notes, voice recording, meeting notes, journal app, study notes, ideaShell",
  openGraph: {
    title: "ideaShell - AI Voice Notes",
    description: "Join ideaShell and receive 100,000 AI Credits!",
    url: "https://ideashell.com",
    siteName: "ideaShell",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ideaShell - AI Voice Notes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ideaShell - AI Voice Notes",
    description: "Join ideaShell and receive 100,000 AI Credits!",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
