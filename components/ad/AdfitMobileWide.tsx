"use client";

import { useAdfitScript } from "@/hooks/useAdfitScript";

export default function AdfitMobileWide() {
  useAdfitScript();
  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit="DAN-HC7AUu1o9OByQtTH"
      data-ad-width="320"
      data-ad-height="100"
    />
  );
}
