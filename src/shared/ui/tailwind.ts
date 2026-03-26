import { cn } from "@/shared/lib/cn";

export const textPrimary = "text-slate-950 dark:text-slate-50";

export const textSecondary = "text-slate-600 dark:text-slate-300/82";

export const textTertiary = "text-slate-500 dark:text-slate-400/78";

export const subtleBorder = "border-slate-200/80 dark:border-white/10";

export const strongBorder = "border-slate-300/90 dark:border-white/16";

export const lineBorder = subtleBorder;

export const glassCard = cn(
  "rounded-[28px] border bg-white/88 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl",
  "dark:bg-slate-950/72 dark:shadow-[0_28px_90px_rgba(2,6,23,0.48)]",
  subtleBorder,
);

export const overlayPanel = cn(
  "rounded-[24px] border bg-white/72 backdrop-blur-md",
  "dark:bg-white/[0.03]",
  subtleBorder,
);

export const softPanel = cn(
  "rounded-[22px] border bg-slate-50/88",
  "dark:bg-white/[0.04]",
  subtleBorder,
);

export const inputSurface = cn(
  "w-full min-h-[220px] resize-y rounded-[24px] border px-5 py-4 text-[15px] leading-7 outline-none transition",
  "bg-white text-slate-950 placeholder:text-slate-400",
  "focus:border-sky-500 focus:ring-4 focus:ring-sky-500/12",
  "dark:bg-slate-950/80 dark:text-slate-50 dark:placeholder:text-slate-500",
  "dark:focus:border-sky-300 dark:focus:ring-sky-300/12",
  strongBorder,
);

export const primaryButton = cn(
  "inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
  "bg-slate-950 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-950/12",
  "disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500",
  "dark:bg-sky-200 dark:text-slate-950 dark:hover:bg-sky-100 dark:focus-visible:ring-sky-200/20 dark:disabled:bg-slate-700 dark:disabled:text-slate-400",
);

export const secondaryButton = cn(
  "inline-flex min-h-12 items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition",
  "bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-950/10",
  "dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/[0.08] dark:focus-visible:ring-white/10",
  strongBorder,
);

export const badge = cn(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.02em]",
  "bg-white/82 text-slate-600 dark:bg-white/[0.05] dark:text-slate-300/85",
  subtleBorder,
);

export const errorPanel = cn(
  "rounded-[20px] border px-4 py-3 text-sm leading-6",
  "border-rose-200 bg-rose-50 text-rose-700",
  "dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-200",
);
