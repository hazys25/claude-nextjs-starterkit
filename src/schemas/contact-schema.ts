import { z } from "zod"

/**
 * 문의 폼 입력값 검증 스키마 (Zod)
 *
 * 한 곳에 스키마를 정의해두면 클라이언트(폼)와 서버(API)가
 * "동일한 규칙"으로 검증할 수 있다. (검증 로직 중복 방지)
 */
export const contactSchema = z.object({
  // 이름: 2자 이상
  name: z
    .string()
    .min(2, { message: "이름은 2자 이상 입력해주세요." }),

  // 이메일: 이메일 형식 검증 (zod v4 의 최상위 z.email 사용)
  email: z.email({ message: "올바른 이메일 형식이 아닙니다." }),

  // 메시지: 10자 이상
  message: z
    .string()
    .min(10, { message: "메시지는 10자 이상 입력해주세요." }),
})

// 스키마로부터 입력값 타입을 자동 추론 → 폼과 API 에서 공통으로 재사용
export type ContactFormValues = z.infer<typeof contactSchema>
