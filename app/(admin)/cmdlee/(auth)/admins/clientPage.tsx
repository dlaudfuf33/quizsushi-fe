"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "@/context/AdminContext";
import AdminRoleBadge from "@/components/admin/adminRoleBadge";
import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import {
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  ChevronDown,
  Check,
  Lock,
} from "lucide-react";
import { AdminAPI } from "@/lib/api/admin.api";

import { Admin } from "@/types/admin.types";

export default function AdminsClientPage() {
  const { admin: currentUser, refreshAdmin } = useAdmin();
  const [currentAdmins, setCurrentAdmins] = useState<Admin[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [newAdmin, setNewAdmin] = useState({
    alias: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "VIEWER",
  });
  // 내 정보 수정 모달 상태
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    alias: currentUser?.alias || "",
    password: "",
    confirmPassword: "",
  });

  const computedLabel = (role: string) => {
    switch (role) {
      case "ROOT":
        return "루트 권한";
      case "ADMIN":
        return "관리자 권한";
      case "MANAGER":
        return "매니저 권한";
      case "VIEWER":
        return "읽기 권한";
      default:
        return "알 수 없음";
    }
  };

  const roleOptions = [
    { label: "읽기 권한", value: "VIEWER" },
    { label: "매니저 권한", value: "MANAGER" },
    { label: "관리자 권한", value: "ADMIN" },
    { label: "루트 권한", value: "ROOT" },
  ];

  // ROOT 권한 확인
  const hasRootPermission = currentUser && currentUser.role === "ROOT";

  const handleAddAdmin = async () => {
    if (
      newAdmin.alias &&
      newAdmin.username &&
      newAdmin.password &&
      newAdmin.confirmPassword
    ) {
      if (newAdmin.password !== newAdmin.confirmPassword) {
        toast.error("비밀번호가 일치하지 않습니다.");
        return;
      }
      if (newAdmin.password.length < 8) {
        toast.error("비밀번호는 8자 이상이어야 합니다.");
        return;
      }
      try {
        await AdminAPI.createAdmin(
          newAdmin.alias,
          newAdmin.username,
          newAdmin.password,
          newAdmin.role
        );
        const admins = await AdminAPI.getAdminList();
        setCurrentAdmins(admins);
        setNewAdmin({
          alias: "",
          username: "",
          password: "",
          confirmPassword: "",
          role: "VIEWER",
        });
        setIsAddModalOpen(false);
        toast.success("관리자가 성공적으로 추가되었습니다.");
      } catch (e: any) {
        toast.error(e?.message || "관리자 추가에 실패했습니다.");
      }
    }
  };

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setIsEditModalOpen(true);
  };

  const handleUpdateAdmin = async () => {
    if (editingAdmin) {
      try {
        await AdminAPI.updateAdminRole(editingAdmin.id, editingAdmin.role);
        const admins = await AdminAPI.getAdminList();
        setCurrentAdmins(admins);
        setEditingAdmin(null);
        setIsEditModalOpen(false);
        toast.success("권한이 성공적으로 변경되었습니다.");
      } catch (e: any) {
        toast.error(e?.message || "권한 변경에 실패했습니다.");
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (
      profileForm.password &&
      profileForm.password !== profileForm.confirmPassword
    ) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await AdminAPI.updateMyProfile(profileForm.alias, profileForm.password);
      toast.success("내 정보가 수정되었습니다.");
      setIsProfileModalOpen(false);
      refreshAdmin();
    } catch (e: any) {
      toast.error(e?.message || "정보 수정에 실패했습니다.");
    }
  };

  const handleDeleteAdmin = async (adminId: number) => {
    if (window.confirm("정말로 이 관리자를 삭제하시겠습니까?")) {
      try {
        await AdminAPI.deleteAdmin(adminId);
        const admins = await AdminAPI.getAdminList();
        setCurrentAdmins(admins);
        toast.success("관리자가 삭제되었습니다.");
      } catch (e: any) {
        toast.error(e?.message || "관리자 삭제에 실패했습니다.");
      }
    }
  };

  // 초기 렌더링 시 관리자 목록 불러오기
  useEffect(() => {
    AdminAPI.getAdminList().then(setCurrentAdmins);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">관리자 관리</h1>
          <p className="text-gray-400">시스템 관리자 계정 관리</p>
        </div>

        {/* ROOT 권한이 있는 경우에만 새 관리자 추가 버튼 표시 */}
        {hasRootPermission ? (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />새 관리자 추가
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed">
            <Lock className="w-4 h-4" />
            <span className="text-sm">권한 없음</span>
          </div>
        )}
      </div>

      {/* 내 정보(프로필) 섹션 */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar.Root className="inline-flex h-16 w-16 select-none items-center justify-center overflow-hidden rounded-full bg-gray-700">
            <Avatar.Fallback className="text-white font-medium text-xl">
              {currentUser?.alias?.[0] || "?"}
            </Avatar.Fallback>
          </Avatar.Root>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-400">{currentUser?.username}</div>
            <div className="font-medium text-white">{currentUser?.alias}</div>
            {currentUser && <AdminRoleBadge role={currentUser.role} />}
          </div>
        </div>
        {currentUser && (
          <button
            onClick={() => {
              setProfileForm({
                alias: currentUser.alias || "",
                password: "",
                confirmPassword: "",
              });
              setIsProfileModalOpen(true);
            }}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            내 정보 수정
          </button>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">관리자 목록</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {currentAdmins?.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-800 rounded-lg hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar.Root className="inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full bg-gray-700">
                    <Avatar.Fallback className="text-white font-medium">
                      {admin.alias[0]}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div>
                    <p className="font-medium text-white">{admin.alias}</p>
                    <p className="text-sm text-gray-400">{admin.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AdminRoleBadge role={admin.role} />

                  {/* ROOT 권한이 있는 경우에만 드롭다운 메뉴 표시 */}
                  {hasRootPermission ? (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          title="더보기 옵션"
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[160px] bg-gray-800 border border-gray-700 rounded-lg p-1 shadow-lg"
                          sideOffset={5}
                        >
                          <DropdownMenu.Item
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded cursor-pointer outline-none"
                            onClick={() => handleEditAdmin(admin)}
                          >
                            <Edit className="w-4 h-4" />
                            권한 변경
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 rounded cursor-pointer outline-none"
                            onClick={() => handleDeleteAdmin(admin.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            삭제
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  ) : (
                    <div
                      className="p-2 text-gray-600 cursor-not-allowed"
                      title="권한이 없습니다"
                    >
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 내 정보 수정 모달 */}
      <Dialog.Root
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md z-[55]">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-semibold text-white">
                내 정보 수정
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  title="닫기"
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  별칭
                </label>
                <input
                  type="text"
                  value={profileForm.alias}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, alias: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="새 별칭"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={profileForm.password}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, password: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="변경할 비밀번호"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={profileForm.confirmPassword}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="비밀번호 다시 입력"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                취소
              </button>
              <button
                onClick={() => handleUpdateProfile()}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
              >
                저장
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ROOT 권한이 있는 경우에만 관리자 추가 모달 렌더링 */}
      {hasRootPermission && (
        <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md z-[55]">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold text-white">
                  새 관리자 추가
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    title="닫기"
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    별칭
                  </label>
                  <input
                    type="text"
                    value={newAdmin.alias}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, alias: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
                    placeholder="관리자 별칭을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    아이디(이메일)
                  </label>
                  <input
                    type="email"
                    value={newAdmin.username}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, username: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
                    placeholder="아이디(이메일)을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
                    placeholder="비밀번호를 입력하세요 (8자 이상)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={newAdmin.confirmPassword}
                    onChange={(e) =>
                      setNewAdmin({
                        ...newAdmin,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    권한
                  </label>
                  <Select.Root
                    value={newAdmin.role}
                    onValueChange={(value) =>
                      setNewAdmin({
                        ...newAdmin,
                        role: value,
                      })
                    }
                  >
                    <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-[60]">
                        <Select.Viewport className="p-1">
                          {roleOptions.map((option) => (
                            <Select.Item
                              key={option.value}
                              value={option.value}
                              className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded cursor-pointer outline-none"
                            >
                              <Select.ItemText>{option.label}</Select.ItemText>
                              <Select.ItemIndicator className="ml-auto">
                                <Check className="w-4 h-4" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  <span className="text-xs text-gray-500 mt-1">
                    현재 권한: {computedLabel(newAdmin.role)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAddAdmin}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  추가
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {/* ROOT 권한이 있는 경우에만 권한 변경 모달 렌더링 */}
      {hasRootPermission && (
        <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md z-[55]">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold text-white">
                  권한 변경
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    title="닫기"
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>

              {editingAdmin && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-white font-medium">
                      {editingAdmin.alias}
                    </p>
                    <p className="text-sm text-gray-400">
                      {editingAdmin.username}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      권한 변경
                    </label>
                    <Select.Root
                      value={editingAdmin.role}
                      onValueChange={(value) =>
                        setEditingAdmin({
                          ...editingAdmin,
                          role: value,
                        })
                      }
                    >
                      <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none">
                        <Select.Value />
                        <Select.Icon>
                          <ChevronDown className="w-4 h-4" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-[60]">
                          <Select.Viewport className="p-1">
                            {roleOptions.map((option) => (
                              <Select.Item
                                key={option.value}
                                value={option.value}
                                className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded cursor-pointer outline-none"
                              >
                                <Select.ItemText>
                                  {option.label}
                                </Select.ItemText>
                                <Select.ItemIndicator className="ml-auto">
                                  <Check className="w-4 h-4" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                    <span className="text-xs text-gray-500 mt-1">
                      현재 권한: {computedLabel(editingAdmin.role)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdateAdmin}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  변경
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
