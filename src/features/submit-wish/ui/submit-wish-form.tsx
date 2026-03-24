"use client";

type SubmitWishFormProps = {
  error: string | null;
  isPending: boolean;
  onSubmit: (wish: string) => void;
  value: string;
  onChange: (value: string) => void;
};

export function SubmitWishForm({
  error,
  isPending,
  onSubmit,
  value,
  onChange,
}: Readonly<SubmitWishFormProps>) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <label className="moon-label" htmlFor="wish-input">
        당신의 소원
      </label>
      <textarea
        id="wish-input"
        className="moon-textarea"
        placeholder="예: 사람들이 내 진심을 편안하게 느끼고, 대화할수록 매력이 깊어지는 분위기를 갖고 싶어."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="moon-form-footer">
        <p className="moon-hint">
          한 문장으로 또렷하게 적을수록 더 잘 맞는 결의 주파수를 만들 수 있어요.
        </p>
        <button className="moon-button" type="submit" disabled={isPending}>
          {isPending ? "주파수 해석 중..." : "나만의 주파수 만들기"}
        </button>
      </div>
      {error ? <p className="moon-error">{error}</p> : null}
    </form>
  );
}
