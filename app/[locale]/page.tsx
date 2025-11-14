import { InvitationCard } from "@/components/invitation/InvitationCard";
import { ImageCarousel } from "@/components/invitation/ImageCarousel";
import { ReviewsSection } from "@/components/invitation/ReviewsSection";
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';

import Image from "next/image";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');

  return (
    <div className="min-h-screen bg-[#f4f4f4] overflow-x-hidden">
      <div className="mx-auto w-full max-w-[402px] lg:max-w-[428px] min-h-screen bg-[#f4f4f4]">
        <div className="flex flex-col gap-6 p-6 pb-[300px]">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 overflow-hidden">
                <Image src="/ideashell.png" width={48} height={48} alt="ideaShell" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-base font-bold text-stone-900">ideaShell</div>
                <div className="justify-center">
                  <span className="text-zinc-500 text-sm font-bold">{t('header.rank')}</span>
                  <span className="text-zinc-500 text-sm font-normal">, </span>
                  <span className="text-zinc-500 text-sm font-bold">{t('header.reviews')}</span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 h-8 bg-[#ff4d23] rounded-full">
              <span className="text-white text-xs font-bold">{t('header.getApp')}</span>
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <span className="text-stone-900 text-3xl font-extrabold leading-10">{t('hero.title')}</span>
              <span className="text-stone-900 text-3xl font-bold leading-10">
                <br />
                {t('hero.for')}
                <br />
              </span>
              <span className="text-stone-900 text-3xl font-semibold leading-10">{t('hero.subtitle')}</span>
            </div>
            <p className="text-zinc-500 text-lg font-medium">{t('hero.description')}</p>
          </div>
          <ImageCarousel />
          <ReviewsSection />
          <div className="flex flex-col gap-2 text-[13px]">
            <div className="text-[#808080]">
              <p className="leading-normal">
                <span className="font-normal">{t('footer.copyright')}</span>
                <span className="font-bold">{t('footer.company')}</span>
              </p>
            </div>
            <div className="text-[#8d8d8d]">
              <p className="leading-normal">
                <span className="text-[#808080]">{t('footer.slogan')}</span>
                <span className="font-bold text-[#ff0000]">{t('footer.dot')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <InvitationCard />
    </div>
  );
}

// Ensure static paths are generated for the dynamic [locale] segment
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Extra hints for static export robustness
export const dynamic = 'force-static';
export const dynamicParams = false;
