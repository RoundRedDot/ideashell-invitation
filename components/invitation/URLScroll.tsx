import React from 'react';

interface URLScrollProps {
  className?: string;
}

export const URLScroll: React.FC<URLScrollProps> = ({ className = '' }) => {
  return (
    <div className={`absolute top-[62px] left-1/2 -translate-x-1/2 h-[32px] px-[18px] py-[9px] backdrop-blur-md bg-[rgba(250,250,250,0.7)] border border-white rounded-[24px] flex items-center justify-center ${className}`}>
      <p className="text-[12px] font-medium text-black tracking-[0.12px]">
        ideashell.com
      </p>
    </div>
  );
};