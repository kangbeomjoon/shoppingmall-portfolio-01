import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! 경고 !!
    // 타입 오류가 있어도 프로덕션 빌드를 성공시킵니다.
    // 프로덕션에서는 false로 설정하는 것을 권장합니다.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
