"use client";

import { useAdmin } from "@/context/AdminContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AdminLogout() {
  const { logout } = useAdmin();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("로그아웃 되었습니다.");
      router.push("/cmdlee/login");
    } catch {
      toast.error("로그아웃 중 문제가 발생했습니다.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
    >
      <LogOut className="h-4 w-4" />
      로그아웃
    </button>
  );
}
