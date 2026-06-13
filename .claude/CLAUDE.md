# CLAUDE.md

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


