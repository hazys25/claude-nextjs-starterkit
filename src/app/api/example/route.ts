import { type NextRequest } from "next/server"

import { errorResponse, successResponse } from "@/lib/api-response"
import { logger } from "@/lib/logger"
import { contactSchema } from "@/schemas/contact-schema"

/**
 * 문의 폼 제출을 처리하는 샘플 API 라우트 (POST /api/example)
 *
 * 이 한 파일에 스타터킷의 API 규칙이 모두 들어있다:
 *   1) Zod 로 입력값 검증
 *   2) 통일된 응답 형식 사용 (successResponse / errorResponse)
 *   3) 에러 발생 시 로그 적재 (errorResponse 내부에서 처리)
 */
export async function POST(request: NextRequest) {
  try {
    // 1) 요청 본문(JSON) 파싱
    const body = await request.json()

    // 2) Zod 로 입력값 검증
    //    safeParse 는 예외를 던지지 않고 성공/실패 결과 객체를 반환한다.
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      // 검증 실패 시 첫 번째 에러 메시지를 사용자에게 전달
      const firstIssue = parsed.error.issues[0]
      return errorResponse(
        "VALIDATION_ERROR",
        firstIssue?.message ?? "입력값이 올바르지 않습니다.",
        400,
      )
    }

    // 3) 검증을 통과한 안전한 데이터
    //    실제 서비스라면 이 지점에서 Supabase 에 저장하는 등의 작업을 한다.
    const contact = parsed.data
    logger.info("문의가 접수되었습니다.", { email: contact.email })

    // 4) 통일된 성공 응답 반환
    return successResponse({
      name: contact.name,
      receivedAt: new Date().toISOString(),
    })
  } catch (error) {
    // 예기치 못한 서버 오류 처리 (JSON 파싱 실패 등) + 로그 적재
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "요청을 처리하는 중 오류가 발생했습니다.",
      500,
      { cause: error instanceof Error ? error.message : String(error) },
    )
  }
}
