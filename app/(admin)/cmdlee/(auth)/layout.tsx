"use client";
import AdminSidebar from "@/components/admin/adminSidebar";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-black">
      <div className="w-64 shrink-0" />
      <div className="fixed left-0 top-0 h-full w-64 z-50">
        <AdminSidebar />
      </div>
      <main className="flex-1 p-3">{children}</main>
    </div>
  );
}
