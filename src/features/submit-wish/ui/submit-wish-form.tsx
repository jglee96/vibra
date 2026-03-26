"use client";

import { cn } from "@/shared/lib/cn";
import {
  badge,
  errorPanel,
  inputSurface,
  primaryButton,
  textPrimary,
  textSecondary,
  textTertiary,
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
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-2">
          <label
            className={`block text-sm font-semibold ${textPrimary}`}
            htmlFor="wish-input"
          >
            당신의 바람
          </label>
          <p className={`m-0 text-sm leading-6 ${textSecondary}`} id={hintId}>
            구체적인 장면과 감정을 함께 적을수록 더 또렷한 리듬으로 정리됩니다.
          </p>
        </div>
        <span className={badge}>3분 오디오 세션</span>
      </div>
      <textarea
        id="wish-input"
        className={inputSurface}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        placeholder="예: 사람들 앞에서 말할 때 숨이 차분해지고, 내 목소리가 자연스럽게 신뢰를 주는 흐름을 살고 싶어."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200/80 bg-slate-50/88 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${textTertiary}`}>
              Primary action
            </p>
            <p className={`mt-1 mb-0 text-sm leading-6 ${textSecondary}`}>
              한 문장으로 입력한 뒤 바로 생성하면, 같은 화면 안에서 결과를 듣고 저장할 수 있어요.
            </p>
          </div>
          <button
            className={cn(primaryButton, "w-full sm:w-auto")}
            type="submit"
            disabled={isPending}
          >
            {isPending ? "주파수 해석 중..." : "내 주파수 열기"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs leading-5">
          <span className="rounded-full bg-white px-3 py-1.5 text-slate-500 dark:bg-white/[0.05] dark:text-slate-300/80">
            기록되지 않음
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 text-slate-500 dark:bg-white/[0.05] dark:text-slate-300/80">
            세션 안에서만 생성
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 text-slate-500 dark:bg-white/[0.05] dark:text-slate-300/80">
            낮은 볼륨 청취 권장
          </span>
        </div>
      </div>
      {error ? (
        <p className={errorPanel} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
