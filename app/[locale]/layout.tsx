import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { getLocalePath, getAssetPath, getCanonicalUrl } from "@/lib/path-utils";
import { Toaster } from "@/components/ui/sonner";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

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
      title: "闪念贝壳 - 帮你记住所有重要事儿的 AI 语音笔记",
      description: "加入闪念贝壳，领取 100,000 AI 积分！10,000+ 条五星好评的 AI 语音笔记应用。适用于会议、想法、日记、学习和思考。",
      keywords: "AI 语音笔记, 语音记录, 会议记录, 日记应用, 学习笔记, 闪念贝壳",
      ogTitle: "闪念贝壳 - AI 语音笔记",
      ogDescription: "加入闪念贝壳，领取 100,000 AI 积分！",
    },
    "zh-TW": {
      title: "閃念貝殼 - 幫你記住所有重要事情的 AI 語音筆記",
      description: "加入閃念貝殼，領取 100,000 AI 積分！超過 10,000 則五星好評的 AI 語音筆記應用。適用於會議、想法、日記、學習與思考。",
      keywords: "AI 語音筆記, 語音記錄, 會議筆記, 日記應用, 學習筆記, 閃念貝殼",
      ogTitle: "閃念貝殼 - AI 語音筆記",
      ogDescription: "加入閃念貝殼，領取 100,000 AI 積分！",
    },
    ja: {
      title: "ideaShell - 大切なことをすべて記録するAI音声ノート",
      description:
        "ideaShellに参加して、100,000 AIクレジットを受け取ろう！10,000件以上の★5レビューを獲得したNo.1 AI音声ノートアプリ。会議、アイデア、日記、勉強、思考に最適。",
      keywords: "AI音声ノート, 音声録音, 会議メモ, 日記アプリ, 勉強ノート, ideaShell",
      ogTitle: "ideaShell - AI音声ノート",
      ogDescription: "ideaShellに参加して、100,000 AIクレジットをゲットしよう！",
    },
    fr: {
      title: "ideaShell - Notes vocales IA pour tout ce qui compte vraiment",
      description:
        "Rejoignez ideaShell et recevez 100 000 crédits IA ! L’application #1 de notes vocales IA avec plus de 10 000 avis 5 étoiles. Parfaite pour les réunions, idées, journaux, études et réflexions.",
      keywords: "notes vocales IA, enregistrement vocal, notes de réunion, application de journal, notes d'étude, ideaShell",
      ogTitle: "ideaShell - Notes vocales IA",
      ogDescription: "Rejoignez ideaShell et recevez 100 000 crédits IA !",
    },
    es: {
      title: "ideaShell - Notas de voz con IA para todo lo que realmente importa",
      description:
        "Únete a ideaShell y recibe 100,000 créditos de IA. La app #1 de notas de voz con IA con más de 10,000 reseñas de 5 estrellas. Ideal para reuniones, ideas, diarios, estudios y reflexiones.",
      keywords: "notas de voz IA, grabación de voz, notas de reunión, app de diario, notas de estudio, ideaShell",
      ogTitle: "ideaShell - Notas de voz IA",
      ogDescription: "Únete a ideaShell y recibe 100,000 créditos de IA.",
    },
    pt: {
      title: "ideaShell - Notas de voz com IA para tudo o que realmente importa",
      description:
        "Junte-se ao ideaShell e ganhe 100.000 créditos de IA! O aplicativo nº 1 de notas de voz com IA com mais de 10.000 avaliações 5 estrelas. Perfeito para reuniões, ideias, diário, estudos e reflexões.",
      keywords: "notas de voz IA, gravação de voz, notas de reunião, aplicativo de diário, notas de estudo, ideaShell",
      ogTitle: "ideaShell - Notas de voz com IA",
      ogDescription: "Junte-se ao ideaShell e ganhe 100.000 créditos de IA!",
    },
    de: {
      title: "ideaShell – KI-Sprachnotizen für alles, was wirklich zählt",
      description:
        "Tritt ideaShell bei und erhalte 100.000 KI-Credits! Die Nr. 1 KI-Sprachnotiz-App mit über 10.000 5-Sterne-Bewertungen. Perfekt für Meetings, Ideen, Tagebuch, Lernen und Gedanken.",
      keywords: "KI-Sprachnotizen, Sprachaufnahme, Besprechungsnotizen, Tagebuch-App, Lernnotizen, ideaShell",
      ogTitle: "ideaShell – KI-Sprachnotizen",
      ogDescription: "Tritt ideaShell bei und erhalte 100.000 KI-Credits!",
    },
  };

  const content = metadata[locale as keyof typeof metadata] || metadata.en;

  // Map locales to OpenGraph locale format
  const ogLocaleMap: Record<string, string> = {
    en: "en_US",
    "zh-CN": "zh_CN",
    "zh-TW": "zh_TW",
    ja: "ja_JP",
    es: "es_ES",
    "pt-BR": "pt_BR",
    fr: "fr_FR",
    de: "de_DE",
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ideashell.com";

  return {
    metadataBase: new URL(siteUrl),
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical: getCanonicalUrl(`/${locale}`, siteUrl),
      languages: {
        en: getLocalePath("en"),
        "zh-CN": getLocalePath("zh-CN"),
        "zh-TW": getLocalePath("zh-TW"),
        ja: getLocalePath("ja"),
        es: getLocalePath("es"),
        "pt-BR": getLocalePath("pt-BR"),
        fr: getLocalePath("fr"),
        de: getLocalePath("de"),
      },
    },
    openGraph: {
      title: content.ogTitle,
      description: content.ogDescription,
      url: getCanonicalUrl(`/${locale}`, siteUrl),
      siteName: "ideaShell",
      images: [
        {
          url: getAssetPath("/ideashell.png"),
          width: 1200,
          height: 630,
          alt: content.ogTitle,
        },
      ],
      locale: ogLocaleMap[locale] || "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.ogTitle,
      description: content.ogDescription,
      images: [getAssetPath("/ideashell.png")],
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

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      <Toaster />
    </NextIntlClientProvider>
  );
}
