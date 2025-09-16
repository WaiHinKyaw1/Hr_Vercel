import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: false,
  skipWaiting: true,
  // Avoid precaching Next.js app router internal manifest which may 404 in prod
  buildExcludes: [/app-build-manifest\.json$/],
});

const nextConfig: NextConfig = {
   env: {
    NEXTAUTH_SECRET: "2334d24031bfc75f79428a4adbf083060c7fb32f153ffb97de7890b4af883c1a",
  },
};

export default withPWA(nextConfig);
