import { lineBorder, textMuted, textPrimary, textSecondary } from "@/shared/ui/tailwind";
import { WishGeneratorWidget } from "@/widgets/wish-generator";

export function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-[-6rem] h-[32rem] bg-[radial-gradient(circle,rgba(155,182,255,0.22),transparent_60%)] blur-3xl motion-safe:animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,214,160,0.12),transparent_66%)] blur-3xl" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-4 pb-20 pt-8 sm:px-6 lg:px-10">
        <section className="grid min-h-[72svh] items-end gap-12 pb-12 pt-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.7fr)]">
          <div className="max-w-[48rem]">
            <p
              className={`mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.38em] ${textMuted}`}
            >
              VIBRA
            </p>
            <div>
              <h1
                className={`m-0 max-w-[11ch] font-serif text-[clamp(3.4rem,9vw,7.4rem)] leading-[0.94] tracking-[-0.055em] ${textPrimary}`}
              >
                모든 것을 끌어당기는 밤의 주파수
              </h1>
              <p className={`mt-6 mb-0 max-w-[38rem] text-lg leading-[1.9] ${textSecondary}`}>
                사랑도, 돈도, 기회도 먼저 내 쪽으로 흐르기 시작하는 밤. 원하는 현실을 한 줄로 적으면
                Vibra가 그 감각을 먼저 울려줍니다.
              </p>
            </div>
          </div>
          <dl className={`border-t ${lineBorder}`} aria-label="서비스 핵심 약속">
            <div className={`border-b py-5 ${lineBorder}`}>
              <dt className={`mb-2 text-[0.72rem] uppercase tracking-[0.24em] ${textMuted}`}>
                관계
              </dt>
              <dd className={`m-0 text-lg leading-8 ${textSecondary}`}>
                사람이 먼저 다정해지는 공기
              </dd>
            </div>
            <div className={`border-b py-5 ${lineBorder}`}>
              <dt className={`mb-2 text-[0.72rem] uppercase tracking-[0.24em] ${textMuted}`}>
                흐름
              </dt>
              <dd className={`m-0 text-lg leading-8 ${textSecondary}`}>돈이 가볍게 붙는 리듬</dd>
            </div>
            <div className={`py-5 ${lineBorder}`}>
              <dt className={`mb-2 text-[0.72rem] uppercase tracking-[0.24em] ${textMuted}`}>
                존재감
              </dt>
              <dd className={`m-0 text-lg leading-8 ${textSecondary}`}>
                기회가 자연스럽게 머무는 분위기
              </dd>
            </div>
          </dl>
        </section>
        <section className={`border-t pt-8 sm:pt-10 ${lineBorder}`}>
          <div className="grid gap-6 sm:grid-cols-3">
            <p className={`m-0 text-sm leading-7 ${textMuted}`}>
              설명보다 먼저 몸이 믿는 쪽으로 밤의 공기를 바꿉니다.
            </p>
            <p className={`m-0 text-sm leading-7 ${textMuted}`}>
              한 줄이면 충분해요. 이미 가진 사람의 온도로 적어보세요.
            </p>
            <p className={`m-0 text-sm leading-7 ${textMuted}`}>
              재생이 시작되는 순간, 내일의 표정과 속도가 먼저 달라집니다.
            </p>
          </div>
        </section>
        <WishGeneratorWidget />
      </div>
    </main>
  );
}
