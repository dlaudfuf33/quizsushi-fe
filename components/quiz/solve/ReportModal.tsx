"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const reasonOptions = [
  { label: "욕설/비하/혐오 표현", value: "ABUSIVE" },
  { label: "도배/광고성 내용", value: "SPAM" },
  { label: "저작권 침해", value: "COPYRIGHT" },
  { label: "기타", value: "ETC" },
];

export default function ReportModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (report: {
    reason: string;
    title: string;
    message: string;
  }) => void;
}) {
  const [reason, setReason] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const isValid = reason && title && message;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>퀴즈 신고</DialogTitle>
        </DialogHeader>

        {/* 드롭다운 셀렉트 */}
        <Select onValueChange={setReason} value={reason}>
          <SelectTrigger>
            <SelectValue placeholder="신고 사유 선택" />
          </SelectTrigger>
          <SelectContent>
            {reasonOptions.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="신고 제목 입력"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2"
        />
        <Textarea
          placeholder="신고 내용을 자세히 입력해주세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2"
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button
            onClick={() => {
              onConfirm({ reason, title, message });
              onClose();
            }}
            disabled={!isValid}
          >
            신고
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
