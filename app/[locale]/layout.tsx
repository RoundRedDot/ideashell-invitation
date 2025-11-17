import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { getLocalePath, getAssetPath, getCanonicalUrl } from "@/lib/path-utils";
import { Toaster } from "@/components/ui/sonner";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Metadata for all supported languages
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
    "zh-TW": {
      title: "ideaShell - 一切重要事項的AI語音筆記",
      description: "加入 ideaShell，獲得 100,000 AI 積分！擁有 10,000+ 五星評價的 #1 AI 語音筆記應用。適用於會議、想法、日記、學習和思考。",
      keywords: "AI語音筆記, 語音錄製, 會議筆記, 日記應用, 學習筆記, ideaShell",
      ogTitle: "ideaShell - AI語音筆記",
      ogDescription: "加入 ideaShell，獲得 100,000 AI 積分！",
    },
    ja: {
      title: "ideaShell - 大切なすべてのためのAIボイスノート",
      description:
        "ideaShellに参加して100,000 AIクレジットを受け取りましょう！10,000以上の5つ星レビューを誇る#1 AIボイスノートアプリ。会議、アイデア、日記、学習、思考に最適です。",
      keywords: "AIボイスノート, 音声録音, 会議メモ, 日記アプリ, 学習ノート, ideaShell",
      ogTitle: "ideaShell - AIボイスノート",
      ogDescription: "ideaShellに参加して100,000 AIクレジットを受け取りましょう！",
    },
    es: {
      title: "ideaShell - Notas de Voz con IA para Todo lo que Importa",
      description:
        "¡Únete a ideaShell y recibe 100,000 Créditos de IA! La aplicación #1 de notas de voz con IA con más de 10,000 reseñas de 5 estrellas. Perfecta para reuniones, ideas, diarios, estudio y pensamientos.",
      keywords: "notas de voz con IA, grabación de voz, notas de reuniones, aplicación de diario, notas de estudio, ideaShell",
      ogTitle: "ideaShell - Notas de Voz con IA",
      ogDescription: "¡Únete a ideaShell y recibe 100,000 Créditos de IA!",
    },
    "pt-BR": {
      title: "ideaShell - Notas de Voz com IA para Tudo o que Importa",
      description:
        "Junte-se ao ideaShell e receba 100.000 Créditos de IA! O aplicativo #1 de notas de voz com IA com mais de 10.000 avaliações 5 estrelas. Perfeito para reuniões, ideias, diários, estudos e pensamentos.",
      keywords: "notas de voz com IA, gravação de voz, notas de reunião, aplicativo de diário, notas de estudo, ideaShell",
      ogTitle: "ideaShell - Notas de Voz com IA",
      ogDescription: "Junte-se ao ideaShell e receba 100.000 Créditos de IA!",
    },
    fr: {
      title: "ideaShell - Notes Vocales IA pour Tout ce qui Compte",
      description:
        "Rejoignez ideaShell et recevez 100 000 Crédits IA ! L'application #1 de notes vocales IA avec plus de 10 000 avis 5 étoiles. Parfaite pour les réunions, les idées, les journaux, les études et les pensées.",
      keywords: "notes vocales IA, enregistrement vocal, notes de réunion, application journal, notes d'étude, ideaShell",
      ogTitle: "ideaShell - Notes Vocales IA",
      ogDescription: "Rejoignez ideaShell et recevez 100 000 Crédits IA !",
    },
    de: {
      title: "ideaShell - KI-Sprachnotizen für Alles was Zählt",
      description:
        "Treten Sie ideaShell bei und erhalten Sie 100.000 KI-Credits! Die #1 KI-Sprachnotizen-App mit über 10.000 5-Sterne-Bewertungen. Perfekt für Meetings, Ideen, Tagebücher, Lernen und Gedanken.",
      keywords: "KI-Sprachnotizen, Sprachaufnahme, Meeting-Notizen, Tagebuch-App, Lernnotizen, ideaShell",
      ogTitle: "ideaShell - KI-Sprachnotizen",
      ogDescription: "Treten Sie ideaShell bei und erhalten Sie 100.000 KI-Credits!",
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
          url: getAssetPath("/og-image.jpg"),
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
      images: [getAssetPath("/og-image.jpg")],
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
