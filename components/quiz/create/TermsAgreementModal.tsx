"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, FileText, Loader2, X } from "lucide-react";

interface TermsAgreementModalProps {
  isOpen: boolean;
  onAgree: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TermsAgreementModal({
  isOpen,
  onAgree,
  onCancel,
  isLoading = false,
}: TermsAgreementModalProps) {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleAgree = () => {
    if (agreed) {
      onAgree();
    }
  };

  const handleCancel = () => {
    setAgreed(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  저작권 및 이용약관 동의
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  퀴즈 생성 전 필수 동의사항입니다
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 주요 동의 내용 */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-3">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  본 문제는 제3자의 저작권을 침해하지 않으며, 본인이 직접
                  작성하였음을 확인합니다.
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  이용약관에 위반되는 콘텐츠는 사전 예고 없이 삭제될 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 상세 약관 */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                상세 준수사항
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  타인의 저작물(책, 논문, 웹사이트 등)을 무단으로 복사하거나
                  사용하지 않습니다
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  부적절하거나 불법적인 내용(욕설, 비방, 차별적 표현 등)을
                  포함하지 않습니다
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>개인정보나 민감한 정보를 포함하지 않습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>
                  허위 정보나 오해를 불러일으킬 수 있는 내용을 포함하지 않습니다
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>상업적 목적의 광고나 홍보 내용을 포함하지 않습니다</span>
              </li>
            </ul>
          </div>

          {/* 법적 책임 안내 */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              ⚖️ 법적 책임
            </h4>
            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
              저작권 침해나 부적절한 콘텐츠로 인한 모든 법적 책임은 작성자에게
              있으며, QuizSushi는 이에 대한 책임을 지지 않습니다. 위반 시 계정
              제재 및 법적 조치가 취해질 수 있습니다.
            </p>
          </div>

          {/* 동의 체크박스 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={isLoading}
                className="mt-1 w-4 h-4 rounded border-2 border-orange-500 text-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                위 모든 내용을 확인하였으며, 저작권 침해가 없는 본인 창작
                문제임을 동의합니다
                <span className="text-red-500 ml-1">*</span>
              </span>
            </label>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              취소
            </Button>
            <Button
              onClick={handleAgree}
              disabled={!agreed || isLoading}
              className={`flex-1 ${
                agreed && !isLoading
                  ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  퀴즈 생성 중...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  동의하고 퀴즈 생성하기
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
