"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api/axios";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.warn(
        <>
          비밀번호 불일치
          <br />
          비밀번호가 서로 다릅니다.
        </>
      );
      return;
    }

    if (!agreeTerms) {
      toast.warn(
        <>
          약관 동의 필요
          <br />
          약관에 동의해주세요.
        </>
      );
      return;
    }

    setIsLoading(true);

    const isValidDate = (y: number, m: number, d: number): boolean => {
      const date = new Date(y, m - 1, d);
      return (
        date.getFullYear() === y &&
        date.getMonth() === m - 1 &&
        date.getDate() === d
      );
    };

    const parsedYear = parseInt(year);
    const parsedMonth = parseInt(month);
    const parsedDay = parseInt(day);

    if (!isValidDate(parsedYear, parsedMonth, parsedDay)) {
      toast.warn(
        <>
          생년월일 오류
          <br />
          올바른 날짜를 입력해주세요.
        </>
      );
      setIsLoading(false);
      return;
    }

    const birthdate = `${year.padStart(4, "0")}-${month.padStart(
      2,
      "0"
    )}-${day.padStart(2, "0")}`;

    try {
      await apiClient.post("/api/auth/register", {
        name,
        email,
        password,
        birthdate,
      });

      toast.success(
        <>
          회원가입 성공
          <br />
          로그인 페이지로 이동합니다.
        </>
      );
      router.push("/verify-email");
    } catch (error: any) {
      const msg = error.response?.data?.message || "회원가입 중 오류 발생";
      toast.error(
        <>
          회원가입 실패
          <br />
          {msg}
        </>
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="name"
            type="text"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>생년월일</Label>
        <div className="flex space-x-2 justify-between">
          <Input
            type="number"
            placeholder="YYYY"
            min={1900}
            max={new Date().getFullYear()}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-1/3"
            required
          />
          <Input
            type="number"
            placeholder="MM"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-1/3"
            required
          />
          <Input
            type="number"
            placeholder="DD"
            min={1}
            max={31}
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-1/3"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          8자 이상, 영문, 숫자, 특수문자 조합
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="비밀번호를 다시 입력해주세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreeTerms}
          onCheckedChange={(checked) => setAgreeTerms(!!checked)}
        />
        <Label htmlFor="terms" className="text-sm font-normal">
          <span>
            <Link href="/terms" className="text-[#FFA07A] hover:underline">
              서비스 이용약관
            </Link>{" "}
            및{" "}
            <Link href="/privacy" className="text-[#FFA07A] hover:underline">
              개인정보 처리방침
            </Link>
            에 동의합니다.
          </span>
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full bg-[#FFA07A] hover:bg-[#FFA07A]/80 text-white"
        disabled={isLoading}
      >
        {isLoading ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
}
