"use client";

import { useAdfitScript } from "@/hooks/useAdfitScript";

const AdfitMobileRect = () => {
  useAdfitScript();
  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit="DAN-RcXXwrkFdWXrvXPw"
      data-ad-width="320"
      data-ad-height="100"
    ></ins>
  );
};

export default AdfitMobileRect;
