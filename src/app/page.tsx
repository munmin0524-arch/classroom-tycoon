import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          교실 타이쿤
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          AI 학급 경영 시뮬레이션
        </p>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          가상의 30명 학급을 맡아 매주 벌어지는 교실 상황에 의사결정을 내리세요.
          <br />
          AI가 결과를 시뮬레이션하고, 멘토가 피드백을 제공합니다.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="text-lg px-8">
              시작하기
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
        <FeatureCard
          emoji="🏫"
          title="가상 학급 경영"
          description="30명의 개성 있는 학생들로 구성된 학급을 맡아 한 학기를 운영하세요."
        />
        <FeatureCard
          emoji="🧠"
          title="AI 시뮬레이션"
          description="당신의 결정에 따라 학생들이 현실적으로 반응합니다. 정답은 없습니다."
        />
        <FeatureCard
          emoji="📈"
          title="성장하는 교실"
          description="학급 레벨을 올리고, 교실을 꾸미고, 교사 유형을 발견하세요."
        />
      </div>

      {/* Footer */}
      <footer className="mt-20 mb-8 text-sm text-muted-foreground">
        교사를 위한, 교사에 의한 시뮬레이션
      </footer>
    </main>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border rounded-xl p-6 text-center hover:border-foreground/20 transition-colors">
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
