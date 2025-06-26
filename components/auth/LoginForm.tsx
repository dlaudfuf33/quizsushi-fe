"use client";

export function LoginForm() {
  const handleSocialLogin = (provider: "google" | "kakao") => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/login`;
  };

  return (
    <div className="space-y-4">
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase"></div>
      </div>

      {/* Google 버튼 */}
      <button
        type="button"
        onClick={() => handleSocialLogin("google")}
        className="w-full h-[45px] p-0 border border-gray-300 bg-white flex items-center justify-center gap-3 rounded-md hover:bg-gray-100"
      >
        <img
          src="/icons/g-logo.png"
          alt="Google"
          className="h-[20px] w-[20px]"
        />
        <span className="text-sm text-gray-700 font-medium">
          Google 계정으로 로그인
        </span>
      </button>

      {/* Kakao 버튼 */}
      <button
        type="button"
        onClick={() => handleSocialLogin("kakao")}
        className="w-full h-[45px] p-0 bg-[#FEE500] flex items-center justify-center rounded"
      >
        <img
          src="/icons/kakao_login_medium_wide.png"
          alt="카카오 로그인"
          className="h-[100%] object-contain"
        />
      </button>
    </div>
  );
}
