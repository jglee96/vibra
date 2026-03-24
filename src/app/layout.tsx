import type { Metadata } from "next";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
  title: "Vibra | 모든 것을 끌어당기는 밤의 주파수",
  description:
    "원하는 현실을 한 줄로 적으면, Vibra가 먼저 그 밤의 분위기를 울려주는 감각적인 주파수 경험",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="bg-[#060816]">
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(120,156,255,0.22),transparent_0_34%),radial-gradient(circle_at_82%_12%,rgba(255,214,160,0.12),transparent_0_24%),radial-gradient(circle_at_20%_78%,rgba(118,92,255,0.12),transparent_0_28%),linear-gradient(180deg,#060816_0%,#0d1230_48%,#090b16_100%)] font-sans text-[#f7f4ee] antialiased">
        {children}
      </body>
    </html>
  );
}
