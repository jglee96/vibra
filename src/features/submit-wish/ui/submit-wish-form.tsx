"use client";

import {
  errorPanel,
  inputSurface,
  primaryButton,
  textPrimary,
  textSecondary,
} from "@/shared/ui/tailwind";

import {
  errorPanel,
  inputSurface,
  primaryButton,
  textPrimary,
  textSecondary,
} from "@/shared/ui/tailwind";

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
  const hintId = "wish-input-hint";
  const errorId = "wish-input-error";

  return (
    <form
      className="grid gap-[0.95rem]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <label
        className={`mb-3 block text-[0.95rem] font-semibold ${textPrimary}`}
        htmlFor="wish-input"
      >
        당신의 소원
      </label>
      <textarea
        id="wish-input"
        className={inputSurface}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        placeholder="예: 돈이 가볍게 들어오고, 내가 들어서는 곳마다 기회가 먼저 나를 알아보는 흐름을 살고 싶어."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex flex-wrap items-stretch justify-between gap-4 sm:items-center">
        <p
          className={`m-0 max-w-[32rem] leading-[1.6] ${textSecondary}`}
          id={hintId}
        >
          한 문장으로 또렷하게 적을수록 더 잘 맞는 결의 주파수를 만들 수 있어요.
        </p>
        <button
          className={`${primaryButton} w-full sm:w-auto`}
          type="submit"
          disabled={isPending}
        >
          {isPending ? "주파수 해석 중..." : "나만의 주파수 만들기"}
        </button>
      </div>
      {error ? (
        <p className={errorPanel} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
