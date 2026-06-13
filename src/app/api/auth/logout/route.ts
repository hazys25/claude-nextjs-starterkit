import { cookies } from "next/headers"

import { successResponse } from "@/lib/api/api-response"
import { SESSION_COOKIE_NAME } from "@/lib/auth/session"

/**
 * 로그아웃 API (POST /api/auth/logout)
 *
 * 세션 쿠키를 삭제하면 다음 요청부터 미들웨어가 비로그인으로 판단한다.
 */
export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  return successResponse({ message: "로그아웃되었습니다." })
}
