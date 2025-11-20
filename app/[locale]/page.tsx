import { InvitationCard } from "@/components/invitation/InvitationCard";
import { ImageCarousel } from "@/components/invitation/ImageCarousel";
import { ReviewsSection } from "@/components/invitation/ReviewsSection";
import { AppDownloadHeader } from "@/components/invitation/AppDownloadHeader";
import { ConditionalWrapper } from "@/components/invitation/ConditionalWrapper";
import { setRequestLocale, getTranslations } from "next-intl/server";
import LanguageSelector from "@/components/LanguageSelector";
import { locales } from "@/i18n/config";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div className="min-h-screen bg-[#f4f4f4] overflow-x-hidden">
      <div className="mx-auto w-full max-w-[402px] lg:max-w-[428px] min-h-screen bg-[#f4f4f4]">
        <div className="flex flex-col gap-6 p-6 pb-[300px]">
          <ConditionalWrapper headerSide>
            <AppDownloadHeader />
          </ConditionalWrapper>
          <div className="flex flex-col gap-1">
            <div className="flex flex-col">
              <span className="text-stone-900 text-3xl font-extrabold leading-10">{t("hero.title")}</span>
              <span className="text-stone-900 text-3xl font-bold leading-10">{t("hero.for")}</span>
              <span className="text-stone-900 text-3xl font-semibold leading-10">{t("hero.subtitle")}</span>
            </div>
            <p className="text-zinc-500 text-lg font-medium">{t("hero.description")}</p>
          </div>
          <ImageCarousel />
          <ReviewsSection />
          <div className="flex flex-col gap-2 text-[13px]">
            <div className="text-[#808080]">
              <p className="leading-normal">
                <span className="font-normal">{t("footer.copyright")}</span>
                <span className="font-bold">{t("footer.company")}</span>
              </p>
            </div>
            <div className="text-[#8d8d8d]">
              <p className="leading-normal">
                <span className="text-[#808080]">Everything starts from a </span>
                <span className="font-bold text-[#ff0000]">Dot.</span>
              </p>
            </div>
          </div>
          <LanguageSelector currentLocale={locale} />
        </div>
      </div>

      <ConditionalWrapper>
        <InvitationCard />
      </ConditionalWrapper>
    </div>
  );
}

// Generate static paths for supported locales only
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Extra hints for static export robustness
export const dynamic = "force-static";
export const dynamicParams = false;
