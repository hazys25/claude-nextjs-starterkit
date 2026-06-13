import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

// 본문용 / 코드용 폰트를 CSS 변수로 등록 (globals.css 의 --font-sans, --font-mono 와 연결)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 브라우저 탭 제목/설명 등 사이트 메타데이터
export const metadata: Metadata = {
  title: "웹 개발 스타터킷",
  description: "Next.js 15 · TypeScript · Tailwind · shadcn/ui · Supabase · Zustand 기반 스타터킷",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 한국어 사이트이므로 lang="ko" 로 지정
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* 전역 토스트(알림)를 한 번만 배치 — 어디서든 toast() 호출 시 여기서 렌더링된다. */}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
