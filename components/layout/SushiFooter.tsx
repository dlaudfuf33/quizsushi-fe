export function SushiFooter() {
  return (
    <footer className="border-t bg-[#F4F4F4] dark:bg-gray-900 dark:border-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍣</span>
              <span className="font-bold text-xl bg-gradient-to-r from-[#FFA07A] to-[#9ACD32] bg-clip-text text-transparent">
                QuizSushi
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              문제를 맛있게 풀다, QuizSushi는 다양한 문제를 공유하는 퀴즈
              플랫폼입니다.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="/browse"
                  className="hover:text-[#FFA07A] transition-colors"
                >
                  문제 풀기
                </a>
              </li>
              <li>
                <a
                  href="/create"
                  className="hover:text-[#FFA07A] transition-colors"
                >
                  문제 만들기
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="mailto:support@quizsushi.com?subject=문의드립니다&body=안녕하세요,%0AQuizSushi 관련하여 문의드립니다.%0A%0A▸ 성함:%0A▸ 이메일:%0A▸ 문의 유형: 건의 사항 / 문제 오류 / 기타%0A▸ 상세 내용:%0A%0A감사합니다."
                  className="hover:text-[#FFA07A] transition-colors"
                >
                  문의하기
                </a>
              </li>
            </ul>
          </div>

          {/* <div>
            <AdfitPcWide />
          </div> */}
        </div>
      </div>
    </footer>
  );
}
