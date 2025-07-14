"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save, User, Mail } from "lucide-react";

import { MemberAPI } from "@/lib/api/member.api";
import type { UserData } from "@/types/profile.types";

import { toast } from "react-toastify";
import BackButton from "@/components/ui/back-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

interface Props {
  userProfile: UserData;
}

export function SettingsClient({ userProfile }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isLoggedIn, user, isInitialized } = useAuth();
  const toastShownRef = useRef(false);

  // 로그인 체크 및 리다이렉트
  useEffect(() => {
    if (isInitialized && !isLoggedIn && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.error("로그인이 필요한 서비스입니다.");
      router.push("/login");
    }
  }, [isLoggedIn, isInitialized, router]);

  // 생년월일 파싱 함수
  const parseBirthDate = (dateString: string) => {
    if (!dateString) return { year: "", month: "", day: "" };
    const [year, month, day] = dateString.split("-");
    return { year: year || "", month: month || "", day: day || "" };
  };

  // 프로필 상태
  const [nickname, setnickname] = useState(userProfile.nickname || "");
  const [gender, setGender] = useState(userProfile.gender || "OTHER");

  // 생년월일 상태
  const initialBirthDate = parseBirthDate(userProfile.birthDate || "");
  const [birthYear, setBirthYear] = useState(initialBirthDate.year || "2000");
  const [birthMonth, setBirthMonth] = useState(initialBirthDate.month || "1");
  const [birthDate, setBirthDate] = useState(initialBirthDate.day || "1");

  // 연도 옵션 생성
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 91 },
    (_, i) => currentYear - 100 + i
  ).reverse();

  // 월 옵션 생성
  const monthOptions = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  // 일 옵션 생성
  const getDaysInMonth = (year: string, month: string) => {
    if (!year || !month) return 31;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10) - 1;
    return new Date(y, m + 1, 0).getDate();
  };

  const dayOptions = Array.from(
    { length: getDaysInMonth(birthYear, birthMonth) },
    (_, i) => (i + 1).toString().padStart(2, "0")
  );
  const handleSaveSettings = async () => {
    setIsLoading(true);

    const isIncomplete =
      !nickname || !birthYear || !birthMonth || !birthDate || !gender;

    if (isIncomplete) {
      toast.error("항목을 모두 채워주세요");
      setIsLoading(false);
      return;
    }

    const birth = `${birthYear.padStart(2, "0")}-${birthMonth.padStart(
      2,
      "0"
    )}-${birthDate.padStart(2, "0")}`;

    try {
      await MemberAPI.updateProfile({ nickname, birth, gender });
      toast.success("설정이 저장되었습니다.");
      router.back();
    } catch (error) {
      toast.error("설정 저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  // const handleSaveSettings = async () => {
  //   setIsLoading(true);
  //   const isIncomplete =
  //     !nickname || !birthYear || !birthMonth || !birthDate || !gender;
  //   if (isIncomplete) {
  //     toast.error("항목을 모두 채워주세요");
  //     return;
  //   }
  //   const birth = `${birthYear}-${birthMonth}-${birthDate}`;
  //   try {
  //     await Promise.all([
  //       MemberAPI.updateProfile({
  //         nickname,
  //         birth,
  //         gender,
  //       }),
  //     ]);
  //     toast.success("설정이 저장되었습니다.");
  //     router.back();
  //   } catch (error) {
  //     toast.error("설정 저장에 실패했습니다.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleDeleteAccount = async () => {
    if (!confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."))
      return;

    setIsLoading(true);
    try {
      await MemberAPI.deleteMe();
      toast.success("회원 탈퇴가 완료되었습니다.");

      // 로그아웃 로직 처리
      router.replace("/login");
    } catch (error) {
      toast.error("회원 탈퇴에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        {/* 뒤로가기 버튼 */}
        <BackButton />

        <div className="space-y-6">
          {/* 프로필 설정 */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#FFA07A]" />
                프로필 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* 프로필 정보 섹션 */}
                <div className="flex-1 space-y-4">
                  {/* 이메일 (읽기 전용) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      이메일
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  {/* 닉네임 */}
                  <div className="space-y-2">
                    <Label htmlFor="nickname">닉네임</Label>
                    <Input
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setnickname(e.target.value)}
                      placeholder="닉네임을 입력하세요"
                      required
                    />
                  </div>
                  {/* 생년월일 (3분할) */}
                  <div className="space-y-2">
                    <Label>생년월일</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Select value={birthYear} onValueChange={setBirthYear}>
                          <SelectTrigger>
                            <SelectValue placeholder="연도" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}년
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Select
                          value={birthMonth}
                          onValueChange={setBirthMonth}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="월" />
                          </SelectTrigger>
                          <SelectContent>
                            {monthOptions.map((month) => (
                              <SelectItem key={month} value={month.toString()}>
                                {parseInt(month.toString(), 10)}월
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Select value={birthDate} onValueChange={setBirthDate}>
                          <SelectTrigger>
                            <SelectValue placeholder="일" />
                          </SelectTrigger>
                          <SelectContent>
                            {dayOptions.map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {parseInt(day.toString(), 10)}일
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 성별 */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">성별</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="성별을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unknown">선택 안함</SelectItem>
                        <SelectItem value="M">남성</SelectItem>
                        <SelectItem value="F">여성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-36">
                {/* 탈퇴 버튼 */}
                <Button
                  variant="ghost"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="bg-gray-600 hover:bg-red-600 text-gray-400"
                >
                  회원 탈퇴
                </Button>

                {/* 저장 버튼 */}
                <Button
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#FFA07A] to-[#FF8C69] hover:from-[#FF8C69] hover:to-[#FFA07A] text-white shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "저장 중..." : "설정 저장"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
