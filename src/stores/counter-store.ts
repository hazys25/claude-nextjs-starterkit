import { create } from "zustand"

/**
 * 카운터 전역 상태 (Zustand 사용 예제)
 *
 * 비유: "전역으로 공유되는 작은 상태 상자".
 *      여러 컴포넌트가 같은 상자를 바라보고, 상자가 바뀌면 함께 다시 그려진다.
 *      props 로 값을 계속 내려주지(prop drilling) 않아도 된다.
 */

// 스토어가 담는 상태값과 액션(상태를 바꾸는 함수)의 형태
interface CounterState {
  // 현재 카운트 값
  count: number
  // 1 증가
  increment: () => void
  // 1 감소
  decrement: () => void
  // 0 으로 초기화
  reset: () => void
}

// create 로 만든 useCounterStore 는 어느 컴포넌트에서든 import 해서 쓰는 훅이다.
// 예) const { count, increment } = useCounterStore()
export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  // set 의 콜백은 이전 상태(state)를 받아 새 상태를 반환한다.
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
