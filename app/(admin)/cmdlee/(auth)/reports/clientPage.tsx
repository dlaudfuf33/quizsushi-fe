"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import * as Dialog from "@radix-ui/react-dialog";
import { AdminAPI } from "@/lib/api/admin.api";
import { toast } from "react-toastify";

import { Report } from "@/types/admin.types";

export default function ReportsClientPage() {
  const [reportFilter, setReportFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreReports = async (nextPage = page + 1, reset = false) => {
    if (isLoading || (!hasNext && !reset)) return;
    setIsLoading(true);
    try {
      const res = await AdminAPI.getReportList({
        page: reset ? 0 : nextPage,
        size: 20,
        searchQuery: searchTerm || undefined,
        status: reportFilter === "all" ? undefined : reportFilter,
      });
      setReports((prev) => (reset ? res.reports : [...prev, ...res.reports]));
      setHasNext((reset ? 1 : nextPage + 1) < res.totalPages);
      setPage(reset ? 0 : nextPage);
    } catch (err) {
      toast.error("신고 불러오기 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasNext(true);
    loadMoreReports(0, true);
  }, [searchTerm, reportFilter]);

  const handleStatusChange = async (reportId: number, newStatus: string) => {
    try {
      await AdminAPI.updateReportStatus(reportId, newStatus);
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? { ...report, status: newStatus, isRead: true }
            : report
        )
      );

      if (selectedReport?.id === reportId) {
        setSelectedReport((prev) =>
          prev ? { ...prev, status: newStatus, isRead: true } : prev
        );
      }
    } catch (error) {
      toast.error("상태 변경 실패");
    }
  };

  // 신고 상세 보기
  const handleViewDetail = async (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
    if (!report.read) {
      try {
        await AdminAPI.markReportAsRead(report.id);
      } catch (err) {
        toast.error("읽음 처리 실패");
      }
    }
  };

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "REJECTED":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      case "PROCESSING":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "RESOLVED":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "PENDING":
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  // 신고 대상 보기
  const handleViewTarget = () => {
    if (!selectedReport) return;
    const { type, id } = selectedReport.reported;
    let url = "#";
    switch (type) {
      case "QUIZ":
        url = `/quiz/solve/${id}`;
        break;
      default:
        url = "#";
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // 신고당한 객체 삭제 처리
  const handleDeleteReportItem = async () => {
    if (!selectedReport) return;
    const { type } = selectedReport.reported;
    try {
      switch (type) {
        case "QUIZ":
          await AdminAPI.deleteQuiz(selectedReport.reported.id);
          break;
        default:
          toast.warn(
            <>
              삭제할 수 없는 타입입니다 <br /> {type}
            </>
          );
          return;
      }
      toast.success("삭제 성공");
    } catch (error) {
      toast.warn("삭제 실패");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">신고 관리</h1>
          <p className="text-gray-400">회원 신고 및 처리 현황</p>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={reportFilter} onValueChange={setReportFilter}>
                <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                  <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="신고자, 피신고자, 사유로 검색..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="text-sm text-gray-400 flex items-center">
              검색 결과: {reports.length}건
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 신고 목록 */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">신고 내역</CardTitle>
          <CardDescription className="text-gray-400">
            회원 신고 및 처리 현황
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div id="scrollableDiv" style={{ height: "600px", overflow: "auto" }}>
            <InfiniteScroll
              dataLength={reports.length}
              next={loadMoreReports}
              hasMore={hasNext}
              loader={
                <div className="text-center text-gray-400 mt-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    불러오는 중...
                  </div>
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">신고 유형</TableHead>
                    <TableHead className="text-gray-300">제목</TableHead>
                    <TableHead className="text-gray-300">신고자</TableHead>
                    <TableHead className="text-gray-300">신고 대상</TableHead>
                    <TableHead className="text-gray-300">신고일</TableHead>
                    <TableHead className="text-gray-300">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow
                      key={report.id}
                      onClick={() => handleViewDetail(report)}
                      className={`border-gray-800 hover:bg-gray-800/50 cursor-pointer ${
                        report.read ? "text-gray-500" : ""
                      }`}
                    >
                      <TableCell>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {report.reported.reason}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {report.title}
                      </TableCell>
                      <TableCell>
                        {report.reporter.id
                          ? `사용자 ${report.reporter.id}`
                          : "익명"}
                        <div className="text-xs text-gray-500">
                          {report.reporter.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {report.reported.type}
                          </Badge>
                          <span className="truncate max-w-[100px]">
                            {report.reported.targetName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{report.createdAt}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs ${getStatusColor(report.status)}`}
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </InfiniteScroll>
          </div>
        </CardContent>
      </Card>

      {/* 신고 상세 모달 */}
      <Dialog.Root open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto z-50">
            {selectedReport && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-bold text-white">
                    신고 상세 정보 #{selectedReport.id}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </Dialog.Close>
                </div>

                <div className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        신고자
                      </label>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-white">
                            {selectedReport.reporter.id
                              ? `사용자 ${selectedReport.reporter.id}`
                              : "익명 사용자"}
                          </span>
                          <div className="text-xs text-gray-400">
                            {selectedReport.reporter.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        신고 대상
                      </label>
                      <div className="flex flex-col justify-start gap-2">
                        <div className="flex flex-row">
                          <Badge variant="outline">
                            {selectedReport.reported.type}
                          </Badge>
                          <span className="text-white">
                            {selectedReport.reported.targetName}
                          </span>
                        </div>

                        <div className="flex flex-row gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleViewTarget}
                            className="text-xs"
                          >
                            보러가기
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleDeleteReportItem}
                            className="text-xs"
                          >
                            삭제하기
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        신고일
                      </label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-white">
                          {selectedReport.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        신고 유형
                      </label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {selectedReport.reported.reason}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* 제목과 메시지 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">
                      신고 제목
                    </label>
                    <p className="text-white bg-gray-800 p-3 rounded-lg">
                      {selectedReport.title}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">
                      신고 내용
                    </label>
                    <p className="text-white bg-gray-800 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedReport.message}
                    </p>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-b border-gray-800">
                    {/* 현재 상태 표시 */}
                    <div className="flex items-center justify-start gap-2">
                      <span className="text-sm text-gray-400">현재 상태:</span>
                      <Badge
                        className={`text-xs ${getStatusColor(
                          selectedReport.status
                        )}`}
                      >
                        {selectedReport.status}
                      </Badge>
                    </div>

                    {/* 상태 변경 버튼들 */}
                    <div className="grid grid-cols-2 gap-3 ">
                      <Button
                        onClick={() => {
                          handleStatusChange(selectedReport.id, "PROCESSING");
                          setSelectedReport({
                            ...selectedReport,
                            status: "PROCESSING",
                          });
                        }}
                        disabled={selectedReport.status === "PROCESSING"}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        PROCESSING
                      </Button>

                      <Button
                        onClick={() => {
                          handleStatusChange(selectedReport.id, "RESOLVED");
                          setSelectedReport({
                            ...selectedReport,
                            status: "RESOLVED",
                          });
                        }}
                        disabled={selectedReport.status === "RESOLVED"}
                        className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        RESOLVED
                      </Button>

                      <Button
                        onClick={() => {
                          handleStatusChange(selectedReport.id, "PENDING");
                          setSelectedReport({
                            ...selectedReport,
                            status: "PENDING",
                          });
                        }}
                        disabled={selectedReport.status === "PENDING"}
                        className="bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        PENDING
                      </Button>

                      <Button
                        onClick={() => {
                          handleStatusChange(selectedReport.id, "REJECTED");
                          setSelectedReport({
                            ...selectedReport,
                            status: "REJECTED",
                          });
                        }}
                        disabled={selectedReport.status === "REJECTED"}
                        className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        REJECTED
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
