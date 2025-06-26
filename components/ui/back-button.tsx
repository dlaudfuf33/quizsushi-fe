"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <>
      <Button
        variant="ghost"
        className="mb-6 hover:bg-white/50"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        돌아가기
      </Button>
    </>
  );
}
