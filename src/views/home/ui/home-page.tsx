import { WishGeneratorWidget } from "@/widgets/wish-generator";

export function HomePage() {
  return (
    <main className="vibra-shell">
      <div className="vibra-container">
        <section className="moon-hero">
          <p className="moon-kicker">조용한 공명 스튜디오</p>
          <div className="moon-hero-body">
            <div>
              <h1 className="moon-title">소원을 차분한 주파수로 정리하는 공간</h1>
              <p className="moon-copy">
                바라는 변화를 한 문장으로 적어주세요. Vibra가 감정의 결을 읽고, 조용히 몰입할 수
                있는 3분 오디오로 정리해드립니다.
              </p>
            </div>
            <dl className="moon-hero-notes" aria-label="서비스 핵심 정보">
              <div className="moon-hero-note">
                <dt>세션 기반</dt>
                <dd>기록 없이 지금 이 화면에서만 생성</dd>
              </div>
              <div className="moon-hero-note">
                <dt>3분 길이</dt>
                <dd>짧고 반복 가능한 개인 청취 리추얼</dd>
              </div>
            </dl>
          </div>
        </section>
        <WishGeneratorWidget />
      </div>
    </main>
  );
}
