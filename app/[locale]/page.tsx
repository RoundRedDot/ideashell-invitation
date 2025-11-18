import { InvitationCard } from "@/components/invitation/InvitationCard";
import { ImageCarousel } from "@/components/invitation/ImageCarousel";
import { ReviewsSection } from "@/components/invitation/ReviewsSection";
import { AppDownloadHeader } from "@/components/invitation/AppDownloadHeader";
import { ConditionalWrapper } from "@/components/invitation/ConditionalWrapper";
import { setRequestLocale, getTranslations } from "next-intl/server";
import LanguageSelector from "@/components/LanguageSelector";
import { locales } from "@/i18n/config";
import { isLocaleVariant, getCanonicalLocale, getAllStaticLocalePaths } from "@/lib/locale-variants";
import { LocaleRedirect } from "@/components/LocaleRedirect";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;

  // Check if this is a locale variant that needs redirection
  if (isLocaleVariant(locale)) {
    const canonicalLocale = getCanonicalLocale(locale);
    if (canonicalLocale) {
      // Return a client-side redirect component
      return <LocaleRedirect from={locale} to={canonicalLocale} />;
    }
  }

  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <div className="min-h-screen bg-[#f4f4f4] overflow-x-hidden">
      <div className="mx-auto w-full max-w-[402px] lg:max-w-[428px] min-h-screen bg-[#f4f4f4]">
        <div className="flex flex-col gap-6 p-6 pb-[300px]">
          <ConditionalWrapper>
            <AppDownloadHeader />
          </ConditionalWrapper>
          <div className="flex flex-col gap-1">
            <div>
              <span className="text-stone-900 text-3xl font-extrabold leading-10">{t("hero.title")}</span>
              <span className="text-stone-900 text-3xl font-bold leading-10">
                <br />
                {t("hero.for")}
                <br />
              </span>
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

// Generate static paths for both supported locales and common variants
export function generateStaticParams() {
  // Generate paths for supported locales
  const supportedPaths = locales.map((locale) => ({ locale }));

  // Generate paths for common locale variants (they will redirect)
  const variantPaths = getAllStaticLocalePaths().map((variant) => ({ locale: variant }));

  // Combine both lists
  return [...supportedPaths, ...variantPaths];
}

// Extra hints for static export robustness
export const dynamic = "force-static";
export const dynamicParams = false;
