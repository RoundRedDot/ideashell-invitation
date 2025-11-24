"use client";

const BottomSlogan = () => {
  const isCN = process.env.NEXT_PUBLIC_APP_DEEPLINK_URL?.includes('cn');
  return <span className="font-bold">{isCN ? "RoundRedDot Tech Co., Ltd." : "RoundRedDot Inc."}</span>;
};

export default BottomSlogan;
