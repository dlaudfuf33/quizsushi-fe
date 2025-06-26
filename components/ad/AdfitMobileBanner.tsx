"use client";

import { useAdfitScript } from "@/hooks/useAdfitScript";

const AdfitMobileBanner = () => {
  useAdfitScript();
  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit="DAN-HC7AUu1o9OByQtTH"
      data-ad-width="320"
      data-ad-height="50"
    ></ins>
  );
};

export default AdfitMobileBanner;
