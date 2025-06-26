"use client";

import { SushiHeader } from "@/components/layout/SushiHeader";
import { SushiFooter } from "@/components/layout/SushiFooter";
import { AuthProvider } from "@/context/AuthContext";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SushiHeader />
      <main className="pt-16">{children}</main>
      <SushiFooter />
    </AuthProvider>
  );
}
