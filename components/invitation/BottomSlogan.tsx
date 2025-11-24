"use client";

import { useIdeaShellDetection } from "@/hooks/useUserAgent";

const BottomSlogan = () => {
  const { isCN } = useIdeaShellDetection();

  return <span className="font-bold">{isCN ? "RoundRedDot Tech Co., Ltd." : "RoundRedDot Inc."}</span>;
};

export default BottomSlogan;
