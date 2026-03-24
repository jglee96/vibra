export function SectionShell({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return <section className={className.trim()}>{children}</section>;
}
