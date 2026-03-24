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
    <html
      lang="ko"
      className="scheme-light-dark bg-[radial-gradient(circle_at_50%_10%,rgba(153,180,255,0.26),transparent_22%),linear-gradient(180deg,#f7f9fd_0%,#f5f7fb_100%)] dark:bg-[radial-gradient(circle_at_50%_10%,rgba(130,158,255,0.2),transparent_22%),linear-gradient(180deg,#091221_0%,#07111f_100%)]"
    >
      <body className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(153,180,255,0.26),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(93,121,201,0.18),transparent_34%),linear-gradient(180deg,#f7f9fd_0%,#f5f7fb_100%)] font-sans text-[#172033] antialiased dark:bg-[radial-gradient(circle_at_50%_0%,rgba(130,158,255,0.2),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(157,189,255,0.12),transparent_34%),linear-gradient(180deg,#091221_0%,#07111f_100%)] dark:text-[#f2f6ff]">
        {children}
      </body>
    </html>
  );
}
