import React from "react";
import Image from "next/image";
import { LeftDecorationIconSVG, RightDecorationIconSVG, ReviewCardTailSVG } from "@/components/ui/icones";

interface ReviewCardProps {
  title: string;
  content: string;
  stars?: number;
}

const reviews = [
  {
    title: "Journaling is healing, Shanshan is amazing!",
    content:
      "After using it for a few days, I feel great and have become a member. Some of the conflicting negative thoughts just seem to dissipate once I write them down; it's different from just recording audio. Overall, Shanshan is really nice!",
  },
  {
    title: "Ready to use right away, a great assistant for creativity!",
    content:
      "I'm a student from opera department and usually need to record many improvised movements. This real-time recording feature will definitely be very convenient for me!",
  },
  {
    title: "User-friendly, excellent experience!",
    content:
      "I am a teacher and often need to record classroom discussions. This tool allows me to quickly capture students' insights, with a clean interface and simple operation, making it perfect for my needs!",
  },
];

const STAR_ICON =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYgMUw3LjU0NSA0LjEzTDExIDQuNjM1TDguNSA3LjA3TDkuMDkgMTAuNUw2IDguODdMMi45MSAxMC41TDMuNSA3LjA3TDEgNC42MzVMNC40NTUgNC4xM0w2IDFaIiBmaWxsPSIjRkZDMjI2Ii8+Cjwvc3ZnPg==";

const ReviewCard: React.FC<ReviewCardProps> = ({ title, content, stars = 5 }) => {
  return (
    <div className="relative bg-white rounded-[16px] p-4 flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <h3 className="text-[16px] font-medium text-[#343434] leading-normal">{title}</h3>
        <p className="text-[14px] text-[#808080] leading-normal">{content}</p>
      </div>

      <div className="flex gap-0.5">
        {Array.from({ length: stars }).map((_, i) => (
          <Image key={i} src={STAR_ICON} alt="star" width={12} height={12} className="block" />
        ))}
      </div>

      <div className="absolute bottom-[-10px] left-4 w-[20px] h-[10px]">
        <ReviewCardTailSVG className="w-full h-full" />
      </div>
    </div>
  );
};

export const ReviewsSection = () => {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-center gap-8">
        <div className="w-[23px] h-[48px] shrink-0">
          <LeftDecorationIconSVG className="w-full h-full" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Image key={i} src={STAR_ICON} alt="star" width={12} height={12} className="block" />
            ))}
          </div>
          <div className="text-[28px] font-bold text-[#343434] leading-none">4.9</div>
          <div className="text-[13px] font-medium text-[#343434] text-center leading-tight uppercase max-w-[110px]">
            10,000+ Global Reviews
          </div>
        </div>

        <div className="w-[23px] h-[48px] shrink-0">
          <RightDecorationIconSVG className="w-full h-full" />
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <ReviewCard key={index} title={review.title} content={review.content} />
        ))}
      </div>
    </div>
  );
};
