"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  // TODO: Supabase Kakao OAuth 연동 후 실제 로그인 로직 추가
  const handleKakaoLogin = () => {
    // 임시: 대시보드로 이동
    window.location.href = "/dashboard";
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">교실 타이쿤</CardTitle>
          <p className="text-muted-foreground text-sm">
            로그인하고 학급 경영을 시작하세요
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleKakaoLogin}
            className="w-full bg-[#FEE500] text-[#191919] hover:bg-[#FDD835] text-base py-6"
          >
            카카오로 시작하기
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleKakaoLogin}
            className="w-full py-6"
          >
            게스트로 체험하기
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            <Link href="/" className="underline">
              홈으로 돌아가기
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
