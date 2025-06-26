export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] dark:bg-gray-800 px-4">
      <div className="text-center">
        <div className="text-9xl mb-4 text-gray-900 dark:text-gray-100">🍽️</div>

        <h1
          className="
            font-bold text-8xl 
            bg-gradient-to-r from-[#FFA07A] to-[#9ACD32]
            dark:from-[#FFB57A] dark:to-[#A0CD32]
            bg-clip-text text-transparent
          "
        >
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-50 mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-50 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <a
          href="/"
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-block"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
