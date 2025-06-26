"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import * as Avatar from "@radix-ui/react-avatar";
import * as Separator from "@radix-ui/react-separator";
import { BarChart3, Users, AlertTriangle, UserCheck, Home } from "lucide-react";
import AdminRoleBadge from "./adminRoleBadge";
import AdminLogout from "./adminlogout";

const navigationItems = [
  {
    title: "대시보드",
    url: "/cmdlee/dashboard",
    icon: BarChart3,
  },
  {
    title: "관리자 관리",
    url: "/cmdlee/admins",
    icon: Users,
  },
  {
    title: "신고/문의 관리",
    url: "/cmdlee/reports",
    icon: AlertTriangle,
  },
  {
    title: "회원 관리",
    url: "/cmdlee/members",
    icon: UserCheck,
  },
];

const systemItems = [
  {
    title: "메인 사이트",
    url: "/",
    icon: Home,
  },
];

export default function AdminSidebar() {
  const { admin } = useAdmin();
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">🍣</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">QuizSushi</h1>
            <p className="text-xs text-gray-400">관리자 시스템</p>
          </div>
        </div>

        {admin ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar.Root className="inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full bg-gray-700">
                <Avatar.Fallback className="text-white font-medium text-xl">
                  {admin.username[0]}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {admin.username}
                </p>
              </div>
            </div>
            <AdminRoleBadge role={admin.role} />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar.Root className="inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full bg-gray-700">
                <Avatar.Fallback className="text-white font-medium text-xl"></Avatar.Fallback>
              </Avatar.Root>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate"></p>
              </div>
            </div>
            <AdminRoleBadge role={"none"} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        {/* Main Navigation */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            관리 메뉴
          </h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.url;
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <Separator.Root className="bg-gray-800 h-px w-full mb-6" />

        {/* System Navigation */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            시스템
          </h3>
          <nav className="space-y-1">
            {systemItems.map((item) => {
              const isActive = pathname === item.url;
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <AdminLogout />
      </div>
    </aside>
  );
}
