'use client';

import React from 'react';

interface StatusBarProps {
  className?: string;
}

// SVG assets for status bar icons
const CELLULAR_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xLjMzMyA0LjY2N2MwLS43MzYuNTk3LTEuMzM0IDEuMzM0LTEuMzM0aDEuMzMzYy43MzYgMCAxLjMzMy41OTggMS4zMzMgMS4zMzR2Ny4zMzNjMCAuNzM3LS41OTcgMS4zMzMtMS4zMzMgMS4zMzNIMi42NjdBMS4zMzMgMS4zMzMgMCAwIDEgMS4zMzMgMTJWNC42Njd6TTcuMzMzIDIuNjY3YzAtLjczNy41OTctMS4zMzQgMS4zMzQtMS4zMzRIMTBjLjczNiAwIDEuMzMzLjU5NyAxLjMzMyAxLjMzNFYxMmMwIC43MzctLjU5NyAxLjMzMy0xLjMzMyAxLjMzM0g4LjY2N0ExLjMzMyAxLjMzMyAwIDAgMSA3LjMzMyAxMlYyLjY2N3pNMTQuNjY3IDBBMS4zMzMgMS4zMzMgMCAwIDAgMTMuMzMzIDEuMzMzVjEyYzAgLjczNy41OTcgMS4zMzMgMS4zMzQgMS4zMzNIMTZjLjczNiAwIDEuMzMzLS41OTYgMS4zMzMtMS4zMzNWMS4zMzNDMTcuMzMzLjU5NyAxNi43MzYgMCAxNiAwSDE0LjY2N3oiIGZpbGw9IiMwMDAiLz48L3N2Zz4=";
const WIFI_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05IDIuNjY3YTguMjEzIDguMjEzIDAgMCAwLTUuODMyIDIuNDE4LjUuNSAwIDAgMS0uNzA4LS43MDdBOS4yMTMgOS4yMTMgMCAwIDEgOSAxLjY2N2E5LjIxMyA5LjIxMyAwIDAgMSA2LjU0IDIuNzExLjUuNSAwIDEgMS0uNzA4LjcwN0E4LjIxMyA4LjIxMyAwIDAgMCA5IDIuNjY3ek05IDUuNjY3YTUuMTcgNS4xNyAwIDAgMC0zLjY2IDEuNTEzLjUuNSAwIDEgMS0uNzA3LS43MDdBNi4xNyA2LjE3IDAgMCAxIDkgNC42NjdhNi4xNyA2LjE3IDAgMCAxIDQuMzY3IDEuODA2LjUuNSAwIDEgMS0uNzA3LjcwN0E1LjE3IDUuMTcgMCAwIDAgOSA1LjY2N3pNOSA4LjY2N2EyLjE2MyAyLjE2MyAwIDAgMC0xLjUzMi42MzQuNS41IDAgMCAxLS43MDgtLjcwN0EzLjE2MyAzLjE2MyAwIDAgMSA5IDcuNjY3YzEuMjM2IDAgMi4zMDcuNzA3IDIuODMyIDEuNzM5YTEgMSAwIDEgMS0xLjY2NCAxLjExQzEwIDkuODc2IDkuNTQxIDguNjY3IDkgOC42Njd6IiBmaWxsPSIjMDAwIi8+PC9zdmc+";
const BATTERY_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgb3BhY2l0eT0iLjM1IiB4PSIuNSIgeT0iLjUiIHdpZHRoPSIyNCIgaGVpZ2h0PSIxMiIgcng9IjMuOCIgc3Ryb2tlPSIjMDAwIi8+PHBhdGggb3BhY2l0eT0iLjQiIGQ9Ik0yNi4zMjggNC0uMDAxIDUuMzUzYy0uMDMxLjU5MS0uMDQ3IDEuMTY5LjAwMSAxLjI5NC4wNDguMTI2LjMzNS41MDQuNjM4LjgyOC4zMDMuMzI1LjU1Mi41Mi42MDEuNTJoLjAzOGMuMDUgMCAuMjk4LS4xOTUuNjAxLS41Mi4zMDQtLjMyNC41OS0uNzAyLjYzOS0uODI4LjA0OC0uMTI1LjAzLS43MDMgMC0xLjI5NEwyNi4zMjggNHoiIGZpbGw9IiMwMDAiLz48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjEiIGhlaWdodD0iOSIgcng9IjIuNSIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==";

export const StatusBar: React.FC<StatusBarProps> = ({ className = '' }) => {
  // Get current time
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  };

  const [time, setTime] = React.useState(getCurrentTime());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute backdrop-blur-[10px] bg-gradient-to-t from-transparent via-[rgba(255,255,255,0.184)] to-transparent top-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] lg:max-w-[428px] px-4 pt-[21px] pb-[19px] flex items-center justify-between ${className}`}>
      {/* Time */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[17px] font-semibold text-black leading-[22px]">
          {time}
        </p>
      </div>

      {/* Status Icons */}
      <div className="flex-1 flex items-center justify-center gap-[7px]">
        {/* Cellular Connection */}
        <div className="w-[19.2px] h-[12.226px]">
          <img src={CELLULAR_ICON} alt="" className="w-full h-full" />
        </div>

        {/* WiFi */}
        <div className="w-[17.142px] h-[12.328px]">
          <img src={WIFI_ICON} alt="" className="w-full h-full" />
        </div>

        {/* Battery */}
        <div className="w-[27.328px] h-[13px]">
          <img src={BATTERY_ICON} alt="" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};