"use client";

import { Badge } from "@/components/ui/badge";
import { AdminRole } from "@/constants/role";
import { Shield } from "lucide-react";

type Props = {
  role?: string;
};

export default function AdminRoleBadge({ role }: Props) {
  let label = "읽기 권한";
  let className = "bg-gray-600 text-white border-gray-400";

  if (role === AdminRole.ROOT) {
    label = "루트 권한";
    className = "bg-orange-500/20 text-orange-400 border-orange-500/30";
  } else if (role === AdminRole.ADMIN) {
    label = "관리자 권한";
    className = "bg-green-500/20 text-green-400 border-green-500/30";
  } else if (role === AdminRole.MANAGER) {
    label = "매니저 권한";
    className = "bg-blue-500/20 text-blue-400 border-blue-500/30";
  } else if (role === AdminRole.VIEWER) {
    label = "읽기 권한";
    className = "bg-gray-600 text-white border-gray-400";
  } else {
    label = "      ";
    className = "bg-gray-600 text-white border-gray-400";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${className}`}
    >
      <Shield className="w-3 h-3" />
      {label}
    </span>
  );
}
