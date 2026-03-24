export const textPrimary = "text-[#f7f4ee]";

export const textSecondary = "text-[rgba(247,244,238,0.76)]";

export const textMuted = "text-[rgba(247,244,238,0.52)]";

export const lineBorder = "border-[rgba(247,244,238,0.14)]";

export const inputSurface = [
  "w-full min-h-[220px] resize-y rounded-[2rem] border px-6 py-5 text-base leading-7 outline-none",
  lineBorder,
  textPrimary,
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))]",
  "placeholder:text-[rgba(247,244,238,0.36)]",
  "transition-[border-color,box-shadow,background,transform] duration-300",
  "focus:border-[rgba(166,188,255,0.42)]",
  "focus:bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.05))]",
  "focus:shadow-[0_0_0_4px_rgba(120,156,255,0.12)]",
].join(" ");

export const primaryButton = [
  "inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold",
  "text-[#060816] transition duration-300 hover:-translate-y-px active:translate-y-0",
  "bg-[linear-gradient(135deg,#f3e6bb_0%,#c9d8ff_52%,#8aa6ff_100%)]",
  "shadow-[0_10px_40px_rgba(138,166,255,0.25)]",
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
  "motion-reduce:transform-none motion-reduce:transition-none",
].join(" ");

export const secondaryButton = [
  "inline-flex min-h-12 items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold",
  lineBorder,
  textPrimary,
  "bg-[rgba(255,255,255,0.04)] transition duration-300 hover:-translate-y-px",
  "hover:bg-[rgba(255,255,255,0.08)] motion-reduce:transform-none",
  "motion-reduce:transition-none",
].join(" ");

export const errorPanel = [
  "rounded-[1.25rem] border px-4 py-3 leading-6",
  "border-[rgba(255,169,181,0.28)] bg-[rgba(120,24,42,0.34)] text-[#ffd8df]",
].join(" ");
