import { cn } from "@/shared/lib/cn";
import { glassCard } from "@/shared/ui/tailwind";

export function SectionShell({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return <section className={cn(glassCard, className)}>{children}</section>;
}
