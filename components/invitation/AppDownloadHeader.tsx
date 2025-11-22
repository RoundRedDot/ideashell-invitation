import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getAssetPath } from "@/lib/path-utils";
import { AppDownloadButton } from "./AppDownloadButton";

export const AppDownloadHeader = async () => {
  const t = await getTranslations("home");

  return (
    <>
      <div className="hidden ios-webview:block h-[calc(env(safe-area-inset-top) - 16px)]"></div>
      <div className="webview:hidden flex items-center justify-between w-full ios-webview:pt-[calc(env(safe-area-inset-top) - 16px)]">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 overflow-hidden">
            <Image src={getAssetPath("/ideashell.png")} width={48} height={48} alt="ideaShell" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="text-base font-bold text-stone-900">ideaShell</div>
            <div className="justify-center">
              <span className="text-zinc-500 text-sm font-bold">{t("header.slug")}</span>
            </div>
          </div>
        </div>
        <AppDownloadButton className="flex items-center gap-2 px-4 py-2 h-8 bg-[#ff4d23] rounded-full">
          <span className="text-white text-xs font-bold">{t("header.getApp")}</span>
        </AppDownloadButton>
      </div>{" "}
    </>
  );
};
