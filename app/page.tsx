import { InvitationCard } from "@/components/invitation/InvitationCard";
import { ImageCarousel } from "@/components/invitation/ImageCarousel";
import { ReviewsSection } from "@/components/invitation/ReviewsSection";

import Image from "next/image";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: PageProps) {
  // Handle both sync and async searchParams (Next.js 15 compatibility)
  const params = searchParams instanceof Promise ? await searchParams : searchParams;

  // Get invitation code from URL parameters (?code=XXX or ?invite=XXX)
  const invitationCode = params?.code || params?.invite || "ER56Y";
  const codeString = Array.isArray(invitationCode) ? invitationCode[0] : invitationCode;

  return (
    <div className="min-h-screen bg-[#f4f4f4] overflow-x-hidden">
      <div className="mx-auto w-full max-w-[402px] lg:max-w-[428px] min-h-screen bg-[#f4f4f4]">
        <div className="flex flex-col gap-6 p-6 pb-[300px]">{/* Extra padding for fixed card */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 overflow-hidden">
                <Image src="/ideashell.png" width={48} height={48} alt="ideaShell" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-base font-bold text-stone-900">ideaShell</div>
                <div className="justify-center">
                  <span className="text-zinc-500 text-sm font-bold">#1</span>
                  <span className="text-zinc-500 text-sm font-normal">, </span>
                  <span className="text-zinc-500 text-sm font-bold">10,000+ 5-Star reviews</span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 h-8 bg-[#ff4d23] rounded-full">
              <span className="text-white text-xs font-bold">Get App</span>
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <span className="text-stone-900 text-3xl font-extrabold leading-10">AI Voice Notes</span>
              <span className="text-stone-900 text-3xl font-bold leading-10">
                <br />
                for
                <br />
              </span>
              <span className="text-stone-900 text-3xl font-semibold leading-10">everything that matters</span>
            </div>
            <p className="text-zinc-500 text-lg font-medium">Meetings / ideas / Journals / Studying / Thoughts</p>
          </div>
          <ImageCarousel />
          <ReviewsSection />
          <div className="flex flex-col gap-2 text-[13px]">
            <div className="text-[#808080]">
              <p className="leading-normal">
                <span className="font-normal">All rights reserved. </span>
                <span className="font-bold">RoundRedDot Inc.</span>
              </p>
            </div>
            <div className="text-[#8d8d8d]">
              <p className="leading-normal">
                <span className="text-[#808080]">Everything starts from a </span>
                <span className="font-bold text-[#ff0000]">Dot.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <InvitationCard invitationCode={codeString} />
    </div>
  );
}
