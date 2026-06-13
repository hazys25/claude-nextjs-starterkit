"use client";

import {
  Code,
  Database,
  Layers,
  Lock,
  LogOut,
  Moon,
  Palette,
  Rocket,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// ── 스타터 킷 특징 목록 ─────────────────────────────────────────────
// 히어로 아래 카드 그리드에 그대로 렌더링되는 데이터.
// icon: lucide-react 아이콘 컴포넌트 / title: 특징 제목 / description: 한 줄 설명
type Feature = {
  // 카드 좌상단에 표시할 아이콘 (컴포넌트 자체를 보관)
  icon: LucideIcon;
  // 특징 제목 (예: "Next.js 15 App Router")
  title: string;
  // 특징을 한 줄로 풀어 쓴 설명
  description: string;
};

const features: Feature[] = [
  {
    icon: Rocket,
    title: "Next.js 15 App Router",
    description: "React 19 서버 컴포넌트 기반의 최신 라우팅으로 빠르게 시작합니다.",
  },
  {
    icon: Code,
    title: "TypeScript",
    description: "엄격한 타입 검사로 런타임 이전에 오류를 잡아냅니다.",
  },
  {
    icon: Palette,
    title: "Tailwind CSS v4 · shadcn/ui",
    description: "토큰 기반 디자인 시스템과 접근성 있는 UI 컴포넌트를 제공합니다.",
  },
  {
    icon: Database,
    title: "Supabase",
    description: "인증·DB·스토리지·실시간을 한 번에 다루는 백엔드를 연결합니다.",
  },
  {
    icon: Layers,
    title: "Zustand",
    description: "보일러플레이트 없는 가벼운 전역 상태관리를 지원합니다.",
  },
  {
    icon: ShieldCheck,
    title: "React Hook Form · Zod",
    description: "스키마 기반의 타입 안전한 폼 검증을 손쉽게 구성합니다.",
  },
  {
    icon: Moon,
    title: "다크 모드 내장",
    description: "next-themes 기반 라이트/다크 전환을 기본 제공합니다.",
  },
  {
    icon: Lock,
    title: "관리자 인증",
    description: "쿠키 세션 기반의 보호 라우트가 미리 구성되어 있습니다.",
  },
];

export default function Home() {
  // 로그아웃 후 로그인 페이지로 이동하기 위해 사용
  const router = useRouter();

  // 로그아웃 핸들러 — 세션 쿠키를 삭제하고 로그인 페이지로 이동
  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("로그아웃되었습니다.");
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* ── 상단 네비바 ───────────────────────────────────────────────
          sticky + 반투명 배경(backdrop-blur)으로 스크롤 시에도 상단에 고정 */}
      <header className="bg-background/70 sticky top-0 z-50 border-b backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          {/* 좌측: 브랜드 — 그라데이션 점 + 텍스트 */}
          <div className="flex items-center gap-2">
            <span className="size-5 rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500" />
            <span className="font-heading text-sm font-semibold tracking-tight">
              Starter Kit
            </span>
          </div>
          {/* 우측: 테마 전환 + 로그아웃 */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut />
              로그아웃
            </Button>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        {/* ── 히어로 섹션 ─────────────────────────────────────────────
            화면 중앙 정렬 + 뒤쪽에 blur 처리된 그라데이션 glow 로 시선 집중 */}
        <section className="relative isolate flex flex-col items-center py-24 text-center sm:py-32">
          {/* 배경 glow — 클릭 막고(-z-10/pointer-events-none) 흐릿한 색 번짐만 연출 */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/25 via-purple-500/25 to-fuchsia-500/25 blur-3xl"
          />

          {/* 작은 배지 — shadcn Badge 미설치라 span 으로 직접 스타일 */}
          <span className="text-muted-foreground mb-6 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
            Next.js 15 · React 19
          </span>

          {/* 메인 타이틀 — 그라데이션 텍스트로 강조 */}
          <h1 className="font-heading max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-6xl">
            빠른 웹 개발을 위한
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              최신 스타터 킷
            </span>
          </h1>

          {/* 보조 설명 */}
          <p className="text-muted-foreground mt-6 max-w-xl text-base text-pretty md:text-lg">
            인증, 상태관리, 폼 검증, 디자인 시스템까지 미리 갖춰진 구성으로 아이디어를 곧바로
            제품으로 만들어보세요.
          </p>
        </section>

        {/* ── 특징 섹션 ───────────────────────────────────────────────
            features 배열을 반응형 카드 그리드로 렌더링 */}
        <section className="pb-24 sm:pb-32">
          {/* 섹션 헤더 */}
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
              필요한 모든 것이 준비되어 있습니다
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              검증된 기술 스택을 영역별로 구성해 설정 없이 바로 기능 개발을 시작할 수 있습니다.
            </p>
          </div>

          {/* 카드 그리드 — 모바일 1열 / 태블릿 2열 / 데스크탑 3열 */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              // 배열에 담아둔 아이콘 컴포넌트를 꺼내 렌더링 (대문자 변수여야 JSX 로 인식)
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="hover:border-foreground/20 transition-colors hover:shadow-sm"
                >
                  <CardHeader>
                    {/* 아이콘 — 그라데이션 배경의 둥근 박스 안에 흰색으로 표시 */}
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
