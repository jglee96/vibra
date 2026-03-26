import type { Metadata } from "next";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
  title: "Vibra | 소원을 차분한 주파수로 정리하는 스튜디오",
  description:
    "한 문장의 바람을 입력하면 Vibra가 감정의 결을 읽고 조용히 집중할 수 있는 3분 오디오로 정리합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="bg-slate-100 dark:bg-slate-950"
    >
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_32%),linear-gradient(180deg,#f5f7fb_0%,#eef2f7_100%)] font-sans text-slate-950 antialiased dark:bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.12),transparent_24%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] dark:text-slate-50">
        {children}
      </body>
    </html>
  );
}
