import { WishGeneratorWidget } from "@/widgets/wish-generator";

export function HomePage() {
  return (
    <main className="vibra-shell">
      <div className="vibra-container">
        <section className="moon-hero">
          <div className="moon-pill">Moonlit Frequency Ritual</div>
          <h1 className="moon-title">소원을 주파수로 바꾸는 밤의 의식</h1>
          <p className="moon-copy">
            당신이 바라는 변화의 장면을 적어주세요. Vibra는 그 소원 속 감정과 결을 해석해, 신비롭고
            안정적인 3분 오디오로 변환합니다.
          </p>
        </section>
        <WishGeneratorWidget />
      </div>
    </main>
  );
}
