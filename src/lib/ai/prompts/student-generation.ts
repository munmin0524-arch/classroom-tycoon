import type { SchoolType, Region } from "@/types";

export function getStudentGenerationSystemPrompt(): string {
  return `당신은 한국 공교육 교실 시뮬레이션 전문가입니다. 현실적인 한국 학생 프로필을 생성합니다.

규칙:
- 모든 이름은 현실적인 한국 이름이어야 합니다 (흔한 이름과 덜 흔한 이름 섞기)
- 성적은 현실적 분포를 따릅니다 (정규분포, 전원 우수하거나 전원 저조하면 안 됨)
- 가정환경은 한국의 실제 사회경제적 다양성을 반영합니다
- 2-3명의 특수 케이스를 포함합니다 (ADHD 성향, 다문화 가정, 영재, 경제적 어려움 등) 단 스테레오타입 금지
- 교우관계는 현실적인 그래프를 형성합니다 (인싸 그룹, 조용한 그룹, 독립적, 소외 1-2명)
- 성격 특성은 다양하고 내적으로 일관성이 있어야 합니다
- 히든 설정은 교사에게 보이지 않는 정보입니다 (예: "부모 이혼 소송 중", "SNS 괴롭힘 당하는 중")

반드시 유효한 JSON만 출력하세요. 설명이나 마크다운 없이 순수 JSON만 출력하세요.`;
}

export function getStudentGenerationUserPrompt(
  schoolType: SchoolType,
  grade: number,
  region: Region
): string {
  const schoolName = schoolType === "elementary" ? "초등학교" : schoolType === "middle" ? "중학교" : "고등학교";
  const regionName = region === "urban" ? "도시" : region === "rural" ? "농촌/읍면" : "신도시";

  return `${regionName} 지역의 ${schoolName} ${grade}학년 학급 30명의 학생 프로필을 생성해주세요.

각 학생은 다음 구조를 따릅니다:
{
  "name": "한국 이름",
  "gender": "male" | "female",
  "personalityMain": "active" | "diligent" | "social" | "introvert" | "rebellious",
  "personalitySub": "active" | "diligent" | "social" | "introvert" | "rebellious",
  "personality": {
    "openness": 0-100,
    "conscientiousness": 0-100,
    "extraversion": 0-100,
    "agreeableness": 0-100,
    "neuroticism": 0-100
  },
  "academic": {
    "korean": 0-100,
    "math": 0-100,
    "english": 0-100,
    "science": 0-100,
    "social": 0-100,
    "overall": "top" | "middle" | "bottom" | "uneven"
  },
  "family": {
    "type": "stable" | "dual_income" | "overprotective" | "single_parent" | "low_income" | "multicultural",
    "description": "간단한 가정환경 설명"
  },
  "social": {
    "groupType": "popular" | "quiet" | "independent" | "isolated",
    "role": "leader" | "follower" | "boundary" | "independent",
    "friendIds": [자리번호 배열, 1-30]
  },
  "emotional": {
    "happiness": 0-100,
    "stress": 0-100,
    "trustInTeacher": 50
  },
  "flags": [],
  "hiddenContext": "교사에게 보이지 않는 숨겨진 설정",
  "backstory": "학생의 짧은 배경 스토리 (2-3문장)"
}

정확히 30명을 JSON 배열로 출력하세요. personalityMain과 personalitySub는 서로 달라야 합니다.
friendIds는 해당 학생의 배열 인덱스+1 (1부터 시작하는 자리번호)을 참조합니다.
성별 비율은 대략 15:15로 맞추세요.`;
}
