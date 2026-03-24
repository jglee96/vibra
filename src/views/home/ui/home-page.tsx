import {
  softPanel,
  textPrimary,
  textSecondary,
  textTertiary,
} from "@/shared/ui/tailwind";
import { WishGeneratorWidget } from "@/widgets/wish-generator";

export function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden before:pointer-events-none before:absolute before:left-1/2 before:top-8 before:h-[min(34rem,72vw)] before:w-[min(34rem,72vw)] before:-translate-x-1/2 before:rounded-full before:bg-[radial-gradient(circle,rgba(168,193,255,0.86),transparent_70%)] before:opacity-[0.88] before:blur-[18px] before:content-[''] after:pointer-events-none after:absolute after:bottom-[-8rem] after:right-[-10rem] after:size-96 after:rounded-full after:bg-[radial-gradient(circle,rgba(93,121,201,0.18),transparent_72%)] after:opacity-[0.55] after:blur-[32px] after:content-[''] dark:before:bg-[radial-gradient(circle,rgba(130,158,255,0.24),transparent_70%)] dark:after:bg-[radial-gradient(circle,rgba(157,189,255,0.16),transparent_72%)] motion-safe:before:animate-[pulse_12s_ease-in-out_infinite]">
      <div className="relative z-10 mx-auto w-full max-w-[1120px] px-4 pt-6 pb-10 sm:px-5 sm:pb-16">
        <section className="grid gap-4 py-7 sm:py-10 sm:pb-6">
          <p
            className={`m-0 text-[0.78rem] font-semibold uppercase tracking-[0.04em] ${textTertiary}`}
          >
            조용한 공명 스튜디오
          </p>
          <div className="grid items-end gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
            <div>
              <h1
                className={`m-0 max-w-[12ch] text-[clamp(2.6rem,6vw,4.75rem)] leading-[1.02] font-bold tracking-[-0.045em] lg:max-w-[11ch] ${textPrimary}`}
              >
                소원을 차분한 주파수로 정리하는 공간
              </h1>
              <p
                className={`mt-4 mb-0 max-w-[40rem] text-base leading-[1.7] ${textSecondary}`}
              >
                바라는 변화를 한 문장으로 적어주세요. Vibra가 감정의 결을 읽고,
                조용히 몰입할 수 있는 3분 오디오로 정리해드립니다.
              </p>
            </div>
            <dl className="m-0 grid gap-3" aria-label="서비스 핵심 정보">
              <div className={`${softPanel} rounded-[20px] px-4 py-[1.05rem]`}>
                <dt className={`text-[0.82rem] font-semibold ${textTertiary}`}>
                  세션 기반
                </dt>
                <dd className={`mt-[0.35rem] ml-0 leading-6 ${textPrimary}`}>
                  기록 없이 지금 이 화면에서만 생성
                </dd>
              </div>
              <div className={`${softPanel} rounded-[20px] px-4 py-[1.05rem]`}>
                <dt className={`text-[0.82rem] font-semibold ${textTertiary}`}>
                  3분 길이
                </dt>
                <dd className={`mt-[0.35rem] ml-0 leading-6 ${textPrimary}`}>
                  짧고 반복 가능한 개인 청취 리추얼
                </dd>
              </div>
            </dl>
          </div>
        </section>
        <WishGeneratorWidget />
      </div>
    </main>
  );
}
