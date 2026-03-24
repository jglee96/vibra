import { glassCard } from "@/shared/ui/tailwind";

export function SectionShell({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return <section className={`${glassCard} ${className}`.trim()}>{children}</section>;
}
