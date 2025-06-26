"use client";
import AdminSidebar from "@/components/admin/adminSidebar";
import { AdminProvider } from "@/context/AdminContext";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen">
      <AdminProvider>
        <main className="flex-1 p-3">{children}</main>
      </AdminProvider>
    </div>
  );
}
