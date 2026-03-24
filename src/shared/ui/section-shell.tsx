export function SectionShell({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return <section className={`moon-card ${className}`.trim()}>{children}</section>;
}
