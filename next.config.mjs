/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 독립 실행형 출력 모드 활성화
  images: {
    domains: ['localhost', 'your-domain.com'], // 이미지 도메인 설정
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  // 프로덕션 환경에서 소스맵 비활성화
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
