"use client";

import { useAdfitScript } from "@/hooks/useAdfitScript";
import { useId } from "react";

export default function AdfitPcSquare() {
  const uniqueId = useId();
  useAdfitScript();

  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit="DAN-T92UUC7Lw0tnc32a"
      data-ad-width="250"
      data-ad-height="250"
      id={uniqueId}
    />
  );
}
