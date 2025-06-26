"use client";
import { useAdfitScript } from "@/hooks/useAdfitScript";

const AdfitPcTall = () => {
  useAdfitScript();
  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit="DAN-9Qw0Nydto3KuqLV4"
      data-ad-width="160"
      data-ad-height="600"
    />
  );
};

export default AdfitPcTall;
