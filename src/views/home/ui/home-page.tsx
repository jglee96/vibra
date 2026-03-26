import { badge, glassCard, softPanel, textPrimary, textSecondary, textTertiary } from "@/shared/ui/tailwind";
import { WishGeneratorWidget } from "@/widgets/wish-generator";

export function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-4 py-5 sm:px-6 sm:py-6 lg:gap-10 lg:px-8 lg:py-8">
        <header className={`${glassCard} relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7`}>
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.24),transparent_72%)] dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_70%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-end">
            <div className="grid gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={badge}>조용한 공명 스튜디오</span>
                <span className={`text-xs font-medium ${textTertiary}`}>
                  Session-only listening tool
                </span>
              </div>
              <div className="grid gap-3">
                <p className={`m-0 text-sm font-semibold tracking-[0.12em] uppercase ${textTertiary}`}>
                  Vibra
                </p>
                <h1 className={`m-0 max-w-[12ch] text-[clamp(2.5rem,6vw,4.9rem)] leading-[0.98] font-semibold tracking-[-0.055em] ${textPrimary}`}>
                  소원을 차분한 주파수로 정리하는 스튜디오
                </h1>
                <p className={`m-0 max-w-[42rem] text-[15px] leading-7 sm:text-base ${textSecondary}`}>
                  바라는 변화를 한 문장으로 적어주세요. Vibra가 감정의 결을 읽고,
                  조용히 집중할 수 있는 3분 오디오 리추얼로 정리해드립니다.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className={`${softPanel} px-4 py-4`}>
                <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
                  Session
                </p>
                <p className={`mt-2 mb-0 text-sm leading-6 ${textPrimary}`}>
                  기록 없이 이 화면 안에서만 생성하고 재생합니다.
                </p>
              </div>
              <div className={`${softPanel} px-4 py-4`}>
                <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
                  Length
                </p>
                <p className={`mt-2 mb-0 text-sm leading-6 ${textPrimary}`}>
                  한 번에 3분, 반복 청취가 쉬운 개인 리추얼 길이입니다.
                </p>
              </div>
              <div className={`${softPanel} px-4 py-4`}>
                <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
                  Focus
                </p>
                <p className={`mt-2 mb-0 text-sm leading-6 ${textPrimary}`}>
                  과한 설명보다 입력, 해석, 재생까지의 흐름에 집중합니다.
                </p>
              </div>
            </div>
          </div>
        </header>
        <WishGeneratorWidget />
      </div>
    </main>
  );
}
