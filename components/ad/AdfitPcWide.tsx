"use client";

import { useAdfitScript } from "@/hooks/useAdfitScript";

const AdfitPcWide = () => {
  useAdfitScript();
  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit="DAN-yuuiCkCHhY6azhmr"
      data-ad-width="728"
      data-ad-height="90"
    ></ins>
  );
};

export default AdfitPcWide;
