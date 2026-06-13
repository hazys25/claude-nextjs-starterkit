"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, Minus, Plus, RotateCcw, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactFormValues } from "@/schemas/contact-schema";
import { useCounterStore } from "@/stores/counter-store";
import type { ApiResponse } from "@/types/api";

// 스타터킷에 포함된 기술 스택 (홈 화면 안내용)
const techStack = [
  "Next.js 15 (App Router)",
  "React 19 · TypeScript",
  "Tailwind CSS v4 · shadcn/ui",
  "Supabase (@supabase/ssr)",
  "Zustand · React Hook Form · Zod",
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

  // ── 1) Zustand 전역 상태 사용 예제 ──────────────────────────────
  // 스토어에서 필요한 값과 액션만 꺼내 쓴다. 값이 바뀌면 이 컴포넌트가 다시 그려진다.
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  // ── 2) React Hook Form + Zod 폼 예제 ───────────────────────────
  // zodResolver 가 contactSchema 규칙으로 입력값을 자동 검증한다.
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // 폼 제출 핸들러 — 검증을 통과한 값만 여기로 전달된다.
  const onSubmit = async (values: ContactFormValues) => {
    try {
      // 샘플 API 라우트(/api/example)로 POST 요청
      const response = await fetch("/api/example", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      // 통일된 응답 형식(ApiResponse)으로 받기
      const result = (await response.json()) as ApiResponse<{
        name: string;
        receivedAt: string;
      }>;

      // success 플래그로 분기 → TypeScript 가 data/error 를 자동 추론
      if (result.success) {
        toast.success(`${result.data.name}님, 문의가 정상 접수되었습니다.`);
        form.reset();
      } else {
        toast.error(result.error.message);
      }
    } catch {
      // 네트워크 오류 등 요청 자체가 실패한 경우
      toast.error("요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      {/* 상단: 페이지 제목 + 로그아웃 버튼 */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <PageHeader
          title="웹 개발 스타터킷"
          description="아래 예제들이 모두 동작하면 개발 환경이 정상적으로 준비된 것입니다."
        />
        {/* 우측: 테마 전환 + 로그아웃 */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut />
            로그아웃
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* 기술 스택 안내 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>포함된 기술 스택</CardTitle>
            <CardDescription>바로 기능 개발을 시작할 수 있도록 구성했습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground grid gap-1 text-sm">
              {techStack.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Zustand 카운터 예제 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>Zustand 전역 상태</CardTitle>
            <CardDescription>버튼을 눌러 전역 카운터 값을 변경해보세요.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={decrement} aria-label="감소">
              <Minus />
            </Button>
            <span className="min-w-12 text-center text-2xl font-semibold tabular-nums">
              {count}
            </span>
            <Button variant="outline" size="icon" onClick={increment} aria-label="증가">
              <Plus />
            </Button>
            <Button variant="ghost" size="sm" onClick={reset} className="ml-auto">
              <RotateCcw />
              초기화
            </Button>
          </CardContent>
        </Card>

        {/* React Hook Form + Zod + 통일 API 응답 예제 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>문의 폼 (RHF + Zod + API)</CardTitle>
            <CardDescription>
              입력값 검증, 통일된 API 응답, 토스트 알림이 함께 동작합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              {/* handleSubmit 이 검증을 수행하고, 통과 시에만 onSubmit 을 호출한다. */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="hong@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>문의 내용</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="문의하실 내용을 10자 이상 입력해주세요."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 제출 중에는 버튼을 비활성화해 중복 제출을 막는다. */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="justify-self-start"
                >
                  <Send />
                  {form.formState.isSubmitting ? "전송 중..." : "문의 보내기"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
