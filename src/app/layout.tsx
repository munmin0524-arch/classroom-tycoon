import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";
import "./globals.css";

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "교실 타이쿤 | AI 학급 경영 시뮬레이션",
  description:
    "AI가 만든 가상 교실에서 교육 상황에 의사결정을 내리고 결과를 체험하는 교사 훈련 시뮬레이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${dotGothic.variable} h-full`}>
      <body className="min-h-full bg-[#1a1a2e] text-white font-[family-name:var(--font-pixel)] overflow-hidden">
        {children}
      </body>
    </html>
  );
}
