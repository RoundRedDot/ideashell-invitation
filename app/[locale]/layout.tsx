import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Placeholder - will be replaced with translated metadata
  const metadata = {
    en: {
      title: "ideaShell - AI Voice Notes for Everything That Matters",
      description:
        "Join ideaShell and receive 100,000 AI Credits! The #1 AI voice notes app with 10,000+ 5-star reviews. Perfect for meetings, ideas, journals, studying, and thoughts.",
      keywords: "AI voice notes, voice recording, meeting notes, journal app, study notes, ideaShell",
      ogTitle: "ideaShell - AI Voice Notes",
      ogDescription: "Join ideaShell and receive 100,000 AI Credits!",
    },
    "zh-CN": {
      title: "ideaShell - 一切重要事项的AI语音笔记",
      description: "加入 ideaShell，获得 100,000 AI 点数！拥有 10,000+ 五星好评的 #1 AI 语音笔记应用。适用于会议、想法、日记、学习和思考。",
      keywords: "AI语音笔记, 语音录制, 会议笔记, 日记应用, 学习笔记, ideaShell",
      ogTitle: "ideaShell - AI语音笔记",
      ogDescription: "加入 ideaShell，获得 100,000 AI 点数！",
    },
  };

  const content = metadata[locale as keyof typeof metadata] || metadata.en;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ideashell.com"),
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "zh-CN": "/zh-CN",
      },
    },
    openGraph: {
      title: content.ogTitle,
      description: content.ogDescription,
      url: "https://ideashell.com",
      siteName: "ideaShell",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: content.ogTitle,
        },
      ],
      locale: locale === "zh-CN" ? "zh_CN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.ogTitle,
      description: content.ogDescription,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Enable static rendering for the specific locale
  setRequestLocale(locale);

  // Load messages for the locale
  const messages = await getMessages();

  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
