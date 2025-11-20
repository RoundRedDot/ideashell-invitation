"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeLabels } from "@/i18n/config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguageIcon } from "./ui/icones";
import { replaceLocaleInPath } from "@/lib/path-utils";
import { useDeviceInfo } from "@/hooks/useUserAgent";

export default function LanguageSelector({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAndroid } = useDeviceInfo();

  const handleLanguageChange = (newLocale: string) => {
    const newPath = replaceLocaleInPath(pathname, newLocale);

    // Preserve query parameters
    const queryString = window.location.search;
    router.push(`${newPath}${queryString}`);
  };

  return (
    <Select value={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-fit h-8 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white">
        <SelectValue asChild>
          <div className="flex items-center gap-1.5">
            <LanguageIcon className="w-4 h-4" />
            {localeLabels[currentLocale as keyof typeof localeLabels]}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" side={isAndroid ? "top" : "bottom"} className="min-w-[180px]">
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale} className="cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="text-sm">{localeLabels[locale as keyof typeof localeLabels]}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
