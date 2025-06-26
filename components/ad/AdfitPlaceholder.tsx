"use client";

import React from "react";

interface AdfitPlaceholderProps {
  width: number;
  height: number;
  top?: number;
  right?: number;
  backgroundColor?: string;
}

export default function AdfitPlaceholder({
  width,
  height,
  top = 120,
  right = 32,
  backgroundColor = "#ffeb3b",
}: AdfitPlaceholderProps) {
  return (
    <div
      className="hidden lg:block"
      style={{
        position: "fixed",
        top,
        right,
        width,
        height,
        backgroundColor,
        color: "#000",
        zIndex: 40,
        textAlign: "center",
        lineHeight: `${height}px`,
        fontWeight: "bold",
        border: "1px solid #999",
      }}
    >
      AD 자리
    </div>
  );
}
