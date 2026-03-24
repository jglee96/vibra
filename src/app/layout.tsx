import type { Metadata } from "next";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
  title: "Vibra | 소원을 주파수로 바꾸는 의식",
  description: "소원을 입력하면 신비롭고 안정적인 주파수 사운드로 바꿔주는 웹 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
