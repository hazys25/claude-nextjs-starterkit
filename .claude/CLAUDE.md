# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 환경
- OS: Window11
- 언어: TypeScript
- 프레임워크: Next.js 15, React 19

## 기술 스택
- CSS: Tailwind CSS
- UI: shadcn/ui
- 백엔드: Supabase (PostgreSQL + Auth + Storage + Realtime)
- 상태관리: Zustand
- 폼: React Hook Form, Zod
- API: Supabase Client, Next.js API Routes
- 파일 처리: Supabase Storage


## 언어 및 커뮤니케이션 규칙
- 기본 응답 언어: 한국어로 작성
- 코드 주석: 한국어로 작성
- 문서화: 한국어로 작성
- (중요)변수명/함수명: 영어로 작성(코드 표준 준수)

## 변수 생성 규칙
- (중요)변수 타입: 변수는 항상 사용하는 목적에 맞는 타입을 선택
- 변수명: 약어를 사용하지 않고 사용 목적에 맞는 풀네임을 선택하여 생성


## Git 규칙
- 커밋 메시지: 한국어와 영어 모두로 작성
- 브랜치명: feature/기능명 형식
- IMPORTANT: 커밋 전에 반드시 린트 실행

## 추가 사항
- DB 트랜잭션 처리 시 부하체크 필수
- 모든 API의 응답 형식은 통일
- 에러 핸들링 필수, 에러 탐지 시 로그 적재


## 명령어

패키지 매니저는 **pnpm** 입니다. (테스트 프레임워크는 아직 없음 — 검증은 lint + build 로 수행)

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (http://localhost:3000) |
| `pnpm build` | 프로덕션 빌드 + 타입 검사 (삭제/리네임 후 잔여 참조 확인용으로도 사용) |
| `pnpm start` | 빌드 결과 실행 |
| `pnpm lint` | ESLint 검사 — **커밋 전 필수** |

> 이 PC의 pnpm 실행 주의사항(PATH/corepack)은 사용자 메모리 `pnpm-setup.md` 참고.

## 필수 환경변수 (`.env.local`)

| 변수 | 용도 |
|------|------|
| `SESSION_SECRET` | JWT 세션 서명 키. **없으면 인증 전체가 throw** (`src/lib/auth/session.ts`) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | 관리자 로그인 계정 (env 기반 단일 계정) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 연결 (사용 시) |

## 아키텍처 (큰 그림)

Next.js 15 App Router 기반. 핵심은 **자체 JWT 인증**, **통일된 API 응답 계약**, **Supabase 이중 클라이언트** 세 축으로 엮여 있습니다.

### 1. 인증 흐름 — 전체 보호 + `/login` 예외

세 파일이 하나의 흐름을 이룹니다. 인증을 건드릴 땐 셋을 함께 봐야 합니다.

- `src/lib/auth/session.ts` — JWT 발급(`signSession`)/검증(`verifySession`). `jose` 사용으로 **Node·Edge 양쪽 호환**. 쿠키명 `admin_session`, 유효기간 8시간 상수도 여기 정의.
- `src/middleware.ts` — **모든 페이지를 가로채** 세션을 검증. 비로그인 → `/login` 리다이렉트, 로그인 상태로 `/login` 접근 → `/` 리다이렉트. `/api/auth/*` 는 항상 통과(로그인 전 호출 필요). `matcher` 로 정적 파일은 제외.
- `src/app/api/auth/login/route.ts` — env 계정과 **타이밍 안전 비교**(`timingSafeEqual`) 후 HTTP-only 쿠키로 세션 발급. 로그아웃은 `api/auth/logout/route.ts` 에서 쿠키 삭제.

> 즉 페이지 보호는 미들웨어가 일괄 담당하므로, 개별 페이지에 인증 가드를 중복으로 넣지 않습니다.

### 2. 통일된 API 응답 계약

모든 라우트 핸들러는 직접 `NextResponse.json` 하지 말고 헬퍼를 거칩니다.

- `src/types/api.ts` — `ApiResponse<T>` 는 `success` 플래그 기반 **판별 유니온**. 클라이언트에서 `if (res.success)` 분기 시 `data`/`error` 가 자동 타입 좁혀짐.
- `src/lib/api-response.ts` — `successResponse(data, status?)` / `errorResponse(code, message, status?, context?)`. **`errorResponse` 는 내부에서 `logger.error` 로 자동 로그 적재**하므로, 에러 응답을 만들면 로깅 규칙이 함께 충족됩니다.
- `src/lib/logger.ts` — 공통 로거.

새 API 라우트를 만들 때 패턴: `try` 안에서 Zod `safeParse` → 실패 시 `errorResponse("VALIDATION_ERROR", ...)`, 성공 처리 후 `successResponse(...)`, `catch` 에서 `errorResponse("INTERNAL_SERVER_ERROR", ..., 500)`. (`login/route.ts` 가 표준 예시)

### 3. Supabase 이중 클라이언트

용도에 따라 import 경로가 다릅니다 — **혼용 금지**.

- `@/lib/supabase/client` (`createClient()`, 동기) → 클라이언트 컴포넌트(`"use client"`)용.
- `@/lib/supabase/server` (`createClient()`, **async — `await` 필요**) → 서버 컴포넌트/라우트 핸들러/서버 액션용. Next.js 15 의 비동기 `cookies()` 와 연동.

### 4. 검증 스키마 일원화

Zod 스키마(`src/schemas/`)를 **클라이언트 폼과 서버 API 가 함께 재사용**합니다. 예: `login-schema.ts` 를 `login/page.tsx`(RHF `zodResolver`)와 `api/auth/login/route.ts`(`safeParse`)가 공유. 폼 필드 규칙을 바꿀 땐 스키마 한 곳만 수정하면 양쪽에 반영됩니다.

### UI / 테마

- shadcn/ui (Base UI 기반) — `src/components/ui/`. 추가 설치: `pnpm dlx shadcn@latest add <component>` (`components.json` 설정 존재).
- 공통 컴포넌트는 `src/components/common/`.
- 테마: `next-themes` + `src/components/theme-provider.tsx`. 기본 light, 시스템 자동전환 off. 디자인 토큰은 `src/app/globals.css` 의 CSS 변수(`--color-*`, `--radius-*`)와 Tailwind v4 `@theme` 로 정의.
