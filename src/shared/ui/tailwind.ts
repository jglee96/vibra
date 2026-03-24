export const textPrimary = "text-[#172033] dark:text-[#f2f6ff]";

export const textSecondary =
  "text-[rgba(23,32,51,0.7)] dark:text-[rgba(242,246,255,0.76)]";

export const textTertiary =
  "text-[rgba(23,32,51,0.5)] dark:text-[rgba(242,246,255,0.52)]";

export const subtleBorder =
  "border-[rgba(110,128,160,0.18)] dark:border-[rgba(176,202,255,0.16)]";

export const strongBorder =
  "border-[rgba(97,119,155,0.28)] dark:border-[rgba(190,214,255,0.28)]";

export const glassCard = [
  "border",
  subtleBorder,
  "rounded-[24px] bg-linear-[180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.74)]",
  "shadow-[0_34px_80px_rgba(128,142,172,0.22)] backdrop-blur-[22px]",
  "dark:bg-linear-[180deg,rgba(13,22,38,0.9),rgba(13,22,38,0.74)]",
  "dark:shadow-[0_36px_96px_rgba(1,7,20,0.44)] sm:rounded-[28px]",
].join(" ");

export const overlayPanel = [
  "border",
  subtleBorder,
  "rounded-[22px] bg-[rgba(255,255,255,0.58)]",
  "dark:bg-[rgba(255,255,255,0.04)]",
].join(" ");

export const softPanel = [
  overlayPanel,
  "backdrop-blur-[16px] shadow-[0_24px_60px_rgba(134,148,176,0.16)]",
  "dark:shadow-[0_28px_70px_rgba(1,7,20,0.34)]",
].join(" ");

export const inputSurface = [
  "w-full min-h-[208px] resize-y rounded-[24px] border px-[1.1rem] py-[1.15rem]",
  subtleBorder,
  textPrimary,
  "bg-linear-[180deg,rgba(239,243,251,0.92),rgba(239,243,251,0.85)]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none",
  "placeholder:text-[rgba(23,32,51,0.5)]",
  "transition-[border-color,box-shadow,background] duration-200",
  "focus:border-[#5d79c9] focus:shadow-[0_0_0_4px_rgba(93,121,201,0.16)]",
  "dark:bg-linear-[180deg,rgba(4,12,23,0.92),rgba(4,12,23,0.85)]",
  "dark:placeholder:text-[rgba(242,246,255,0.52)]",
  "dark:focus:border-[#9dbdff] dark:focus:shadow-[0_0_0_4px_rgba(157,189,255,0.16)]",
].join(" ");

export const primaryButton = [
  "min-h-12 rounded-full border px-[1.4rem] py-[0.95rem] text-sm font-semibold text-white",
  "border-[rgba(93,121,201,0.44)] bg-linear-[180deg,#7391dd,#4763b6]",
  "shadow-[0_10px_22px_rgba(93,121,201,0.26)] transition",
  "duration-200 hover:-translate-y-px hover:border-[rgba(93,121,201,0.56)]",
  "hover:shadow-[0_12px_26px_rgba(93,121,201,0.32)] active:translate-y-0",
  "disabled:cursor-not-allowed disabled:opacity-[0.62] disabled:shadow-none",
  "motion-reduce:transform-none motion-reduce:transition-none",
].join(" ");

export const secondaryButton = [
  "inline-flex min-h-12 min-w-40 items-center justify-center rounded-full border px-[1.2rem]",
  "py-[0.85rem] font-semibold no-underline transition duration-200",
  strongBorder,
  textPrimary,
  "bg-[rgba(255,255,255,0.58)] hover:-translate-y-px",
  "hover:border-[#5d79c9] hover:bg-[rgba(93,121,201,0.14)]",
  "dark:bg-[rgba(255,255,255,0.04)] dark:hover:border-[#9dbdff]",
  "dark:hover:bg-[rgba(157,189,255,0.12)] motion-reduce:transform-none",
  "motion-reduce:transition-none",
].join(" ");

export const errorPanel = [
  "rounded-[18px] border px-4 py-[0.95rem] leading-6",
  "border-[rgba(179,58,67,0.3)] bg-[rgba(179,58,67,0.12)] text-[#b33a43]",
  "dark:border-[rgba(255,214,216,0.3)] dark:bg-[rgba(108,24,35,0.32)]",
  "dark:text-[#ffd6d8]",
].join(" ");
