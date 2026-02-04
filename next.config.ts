import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    turbo: true, // Если используете Turbopack
  },
  
  // Отключаем кэширование в development
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
      // Дополнительные настройки для сброса кэша
      config.snapshot = {
        ...config.snapshot,
        managedPaths: [], // Не кэшировать node_modules
        immutablePaths: [], // Полностью отключаем immutable кэш
      };
    }
    return config;
  }
};

export default nextConfig;