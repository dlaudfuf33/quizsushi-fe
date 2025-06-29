"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, UserX, UserCheck, MoreHorizontal, Ban } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import InfiniteScroll from "react-infinite-scroll-component";
import { AdminAPI, Member } from "@/lib/api/admin.api";
import { toast } from "react-toastify";

export default function MembersClientPage() {
  const { admin: currentUser } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "활성" | "정지" | "탈퇴"
  >("all");

  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async (nextPage = page + 1, reset = false) => {
    if (isLoading || (!hasNext && !reset)) return;
    setIsLoading(true);
    try {
      const res = await AdminAPI.getMemberList({
        page: reset ? 0 : nextPage,
        size: 20,
        searchQuery: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setMembers((prev): Member[] =>
        reset ? res.members : [...prev, ...res.members]
      );
      setHasNext((reset ? 1 : nextPage + 1) < res.totalPages);
      setPage(reset ? 0 : nextPage);
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasNext(true);
    loadMore(0, true);
  }, [searchTerm, statusFilter]);

  const handleStatusChange = async (
    memberId: number,
    newStatus: "활성" | "정지"
  ) => {
    try {
      await AdminAPI.updateMemberStatus(memberId, newStatus);
      setMembers(
        members.map((member) =>
          member.id === memberId ? { ...member, status: newStatus } : member
        )
      );
    } catch (error) {
      toast.error(
        <>
          회원 상태 변경 실패:
          <br />
          {(error as any)?.response?.data?.message ||
            (error as Error).message ||
            "알 수 없는 오류"}
        </>
      );
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "활성":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "정지":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "탈퇴":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">회원 관리</h1>
          <p className="text-gray-400">전체 회원 현황 및 활동 내역</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="회원 검색..."
              className="pl-10 w-64 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            title="상태"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "활성" | "정지" | "탈퇴"
              )
            }
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
          >
            <option value="all">전체 상태</option>
            <option value="활성">활성</option>
            <option value="정지">정지</option>
            <option value="탈퇴">탈퇴</option>
          </select>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">전체 회원</p>
                <p className="text-2xl font-bold text-white">
                  {members.length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">활성 회원</p>
                <p className="text-2xl font-bold text-green-400">
                  {members.filter((m) => m.status === "활성").length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">정지 회원</p>
                <p className="text-2xl font-bold text-red-400">
                  {members.filter((m) => m.status === "정지").length}
                </p>
              </div>
              <Ban className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">탈퇴 회원</p>
                <p className="text-2xl font-bold text-red-400">
                  {members.filter((m) => m.status === "탈퇴").length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">회원 목록</CardTitle>
          <CardDescription className="text-gray-400">
            검색된 회원: {members.length}명
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InfiniteScroll
            dataLength={members.length}
            next={loadMore}
            hasMore={hasNext}
            loader={
              <p className="text-sm text-center text-gray-500 py-4">
                불러오는 중...
              </p>
            }
            scrollThreshold={0.9}
          >
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">이메일</TableHead>
                  <TableHead className="text-gray-300">닉네임</TableHead>
                  <TableHead className="text-gray-300">가입일</TableHead>
                  <TableHead className="text-gray-300">상태</TableHead>
                  <TableHead className="text-gray-300">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className="border-gray-800">
                    <TableCell className="font-medium text-white">
                      {member.email}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {member.nickname}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {member.createdAt}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadgeClass(
                          member.status
                        )}`}
                      >
                        {member.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {member.status !== "탈퇴" && (
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                              <DropdownMenu.Content
                                className="min-w-[120px] bg-gray-800 border border-gray-700 rounded-lg p-1 shadow-lg"
                                sideOffset={5}
                              >
                                {member.status === "활성" ? (
                                  <DropdownMenu.Item
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 rounded cursor-pointer outline-none"
                                    onClick={() =>
                                      handleStatusChange(member.id, "정지")
                                    }
                                  >
                                    <UserX className="w-4 h-4" />
                                    정지
                                  </DropdownMenu.Item>
                                ) : (
                                  <DropdownMenu.Item
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-green-400 hover:text-green-300 hover:bg-gray-700 rounded cursor-pointer outline-none"
                                    onClick={() =>
                                      handleStatusChange(member.id, "활성")
                                    }
                                  >
                                    <UserCheck className="w-4 h-4" />
                                    활성화
                                  </DropdownMenu.Item>
                                )}
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </CardContent>
      </Card>
    </div>
  );
}
