import type { EventCategory, PresetChoice } from "@/types";

export interface MockEvent {
  id: string;
  weekNumber: number;
  triggerStudentId: string;
  weekRange: [number, number];
  prerequisiteEventId?: string;
  eventType: EventCategory;
  severity: number;
  title: string;
  description: string;
  involvedStudentIds: string[];
  presetChoices: PresetChoice[];
}

export interface MockOutcome {
  narrative: string;
  resourceChanges: {
    studentTrust: number;
    parentSatisfaction: number;
    schoolReputation: number;
    teacherEnergy: number;
  };
  mentorFeedback: string;
  triggersGameover?: boolean;
  gameoverDelay?: number;
}

// ── 15명 학생별 시나리오 (30+ 이벤트) ──

export const MOCK_EVENTS: MockEvent[] = [
  // ═══ s1 김민준: 학업 압박 ═══
  {
    id: "e_s1_1", weekNumber: 3, triggerStudentId: "s1", weekRange: [2, 6],
    eventType: "academic", severity: 3,
    title: "학원 5개의 무게",
    description: "김민준(1번)이 수업 중 잠들었습니다. 깨우자 눈물을 글썽이며 '학원 숙제 안 하면 엄마한테 혼나요... 어제도 새벽 1시에 잤어요'라고 말합니다. 옆자리 친구들이 놀란 표정으로 쳐다봅니다.",
    involvedStudentIds: ["s1"],
    presetChoices: [
      { id: "c1", text: "학부모 면담을 요청하여 학원 과부하 문제를 직접 제기한다.", approach: "professional" },
      { id: "c2", text: "쉬는 시간에 10분 낮잠을 허용하고, 체력 관리를 함께 지도한다.", approach: "democratic" },
      { id: "c3", text: "수업 태도 평가를 경고하며 원칙적으로 대응한다.", approach: "authoritative" },
    ],
  },
  {
    id: "e_s1_2", weekNumber: 15, triggerStudentId: "s1", weekRange: [12, 20],
    eventType: "behavior", severity: 2,
    title: "민준이의 갑작스러운 무기력",
    description: "활발하던 김민준(1번)이 최근 급격히 무기력해졌습니다. 체육 시간에도 참여를 거부하고, '그냥 피곤해요'만 반복합니다. 성적도 눈에 띄게 떨어졌습니다.",
    involvedStudentIds: ["s1"],
    presetChoices: [
      { id: "c1", text: "1:1 상담을 통해 무기력의 원인을 파악한다.", approach: "professional" },
      { id: "c2", text: "친한 친구에게 민준이 상태를 물어본다.", approach: "democratic" },
      { id: "c3", text: "학부모에게 연락하여 가정에서의 변화를 확인한다.", approach: "professional" },
    ],
  },

  // ═══ s2 이서윤: 학부모 민원 "우리 애 기 죽이지 마세요" ═══
  {
    id: "e_s2_1", weekNumber: 5, triggerStudentId: "s2", weekRange: [4, 10],
    eventType: "parent", severity: 4,
    title: "밤 10시 카톡: \"우리 애 기 죽이지 마세요\"",
    description: "수업 중 서윤이의 실수를 부드럽게 지적했는데, 그날 밤 10시에 어머니에게서 장문의 카톡이 옵니다. \"선생님, 서윤이가 집에 와서 밥도 안 먹고 울기만 해요. 아이의 자존감을 짓밟는 건 정서적 학대 아닌가요? 교육청에 민원 넣겠습니다.\"",
    involvedStudentIds: ["s2"],
    presetChoices: [
      { id: "c1", text: "죄송하다고 사과하며 내일부터 부드럽게 대하겠다고 약속한다.", approach: "permissive" },
      { id: "c2", text: "학교 일과 시간에 통화하자고 원칙적으로 대응한다.", approach: "professional" },
      { id: "c3", text: "교육청 가이드라인을 전송하며 정당한 훈육임을 강조한다.", approach: "authoritative" },
    ],
  },
  {
    id: "e_s2_2", weekNumber: 18, triggerStudentId: "s2", weekRange: [15, 25],
    prerequisiteEventId: "e_s2_1",
    eventType: "mental", severity: 3,
    title: "서윤이의 완벽주의 폭발",
    description: "시험에서 98점을 받은 이서윤(2번)이 화장실에서 울고 있는 걸 다른 학생이 발견했습니다. '2점 틀리면 엄마가 실망하시는데...' 서윤이의 손에 지우개로 긁은 자국이 보입니다.",
    involvedStudentIds: ["s2"],
    presetChoices: [
      { id: "c1", text: "상담교사에게 즉시 연계하고 어머니에게도 연락한다.", approach: "professional" },
      { id: "c2", text: "서윤이와 조용히 대화하며 '98점은 훌륭하다'고 안심시킨다.", approach: "democratic" },
      { id: "c3", text: "어머니를 학교로 불러 서윤이의 상태를 직접 보여준다.", approach: "authoritative" },
    ],
  },

  // ═══ s3 박지호: 교실 붕괴 ═══
  {
    id: "e_s3_1", weekNumber: 4, triggerStudentId: "s3", weekRange: [3, 8],
    eventType: "behavior", severity: 3,
    title: "수업 방해의 에스컬레이션",
    description: "박지호(3번)가 수업 중 지우개를 던지며 장난을 치고 있습니다. 주의를 주자 '뭐가 어쩔 건데요?'라며 비웃는 표정을 짓습니다. 반 아이들이 킥킥 웃고, 수업 진행이 어렵습니다.",
    involvedStudentIds: ["s3"],
    presetChoices: [
      { id: "c1", text: "이름을 부르며 단호하게 경고하고 행동 기록부에 기재한다.", approach: "authoritative" },
      { id: "c2", text: "잠시 수업을 멈추고 지호에게 '왜 그러는지' 물어본다.", approach: "democratic" },
      { id: "c3", text: "무시하고 수업을 계속 진행한다.", approach: "permissive" },
    ],
  },
  {
    id: "e_s3_2", weekNumber: 10, triggerStudentId: "s3", weekRange: [8, 16],
    prerequisiteEventId: "e_s3_1",
    eventType: "behavior", severity: 5,
    title: "\"선생님이 뭔데 상관이에요?\"",
    description: "수업 도중 엎드려 자는 박지호(3번)를 깨웠더니, 갑자기 벌떡 일어나 전교생이 보는 앞에서 소리를 지릅니다. \"선생님이 뭔데 상관이에요? 선생님이나 잘하세요. 짜증 나게!\" 교실에 정적이 흐릅니다. 30개의 눈이 당신을 쳐다봅니다.",
    involvedStudentIds: ["s3"],
    presetChoices: [
      { id: "c1", text: "즉시 교실 밖으로 퇴실시키고 선도위원회에 회부한다.", approach: "authoritative" },
      { id: "c2", text: "일단 수업을 계속 진행하고, 방과 후에 따로 불러 진심 어린 대화를 시도한다.", approach: "democratic" },
      { id: "c3", text: "유머로 넘기며 분위기를 전환한다. '오, 아침부터 에너지가 넘치네~'", approach: "permissive" },
    ],
  },

  // ═══ s4 최수아: 교사 자녀 딜레마 ═══
  {
    id: "e_s4_1", weekNumber: 6, triggerStudentId: "s4", weekRange: [4, 12],
    eventType: "admin", severity: 3,
    title: "교무실의 불편한 부탁",
    description: "같은 학교 교사인 수아의 아버지가 교무실에서 공개적으로 말합니다. \"선생님, 수아 성적 좀 신경 써주세요. 특히 과학 수행평가 기준이 좀 애매하던데, 수아한테 유리하게 좀...\" 다른 교사 3명이 이 대화를 듣고 있습니다.",
    involvedStudentIds: ["s4"],
    presetChoices: [
      { id: "c1", text: "공정성 원칙을 설명하며 정중하지만 단호하게 거절한다.", approach: "professional" },
      { id: "c2", text: "수아에게 보충 수업 기회를 다른 학생들과 동등하게 제공한다.", approach: "democratic" },
      { id: "c3", text: "동료 관계를 위해 조용히 추가 과제만 내준다.", approach: "permissive" },
    ],
  },

  // ═══ s5 정하늘: 또래 갈등 조정 번아웃 ═══
  {
    id: "e_s5_1", weekNumber: 8, triggerStudentId: "s5", weekRange: [6, 14],
    eventType: "mental", severity: 3,
    title: "조율자의 한계",
    description: "반 친구들 사이 갈등을 매번 중재하던 정하늘(5번)이 갑자기 보건실로 갔습니다. 보건교사에게 들으니 '나도 힘들어요. 왜 맨날 나만 해결해야 해요...'라며 울었다고 합니다. 최근 하늘이의 표정이 어두워지고 있었습니다.",
    involvedStudentIds: ["s5"],
    presetChoices: [
      { id: "c1", text: "하늘이의 '조정자 역할' 짐을 덜어주는 학급 회의를 소집한다.", approach: "democratic" },
      { id: "c2", text: "보건실에 직접 가서 1:1 상담, 쉬어도 된다고 안심시킨다.", approach: "permissive" },
      { id: "c3", text: "학급 자치 규칙을 만들어 갈등 해결 절차를 공식화한다.", approach: "professional" },
    ],
  },

  // ═══ s6 한예은: 자해 의심 + 성적 압박 ═══
  {
    id: "e_s6_1", weekNumber: 9, triggerStudentId: "s6", weekRange: [7, 15],
    eventType: "mental", severity: 5,
    title: "긴팔 옷 아래의 상처",
    description: "전교 1등이던 한예은(6번)의 성적이 3등으로 떨어졌습니다. 미술 시간에 소매가 걷히면서 팔 안쪽에 여러 개의 얇은 상처 자국이 보였습니다. 예은이는 황급히 소매를 내리며 '넘어져서 그래요'라고 둘러댑니다. 눈이 빨갛습니다.",
    involvedStudentIds: ["s6"],
    presetChoices: [
      { id: "c1", text: "즉시 Wee클래스 상담교사에게 연계하고 학부모에게도 연락한다.", approach: "professional" },
      { id: "c2", text: "예은이와 단둘이 조심스럽게 대화를 시도한다. '선생님이 걱정돼서...'", approach: "democratic" },
      { id: "c3", text: "성적 압박을 줄이기 위해 수행평가 가산점을 부여한다.", approach: "permissive" },
    ],
  },

  // ═══ s7 윤서준: 게임 중독 + 등교 거부 ═══
  {
    id: "e_s7_1", weekNumber: 7, triggerStudentId: "s7", weekRange: [5, 12],
    eventType: "behavior", severity: 3,
    title: "3일째 빈 자리",
    description: "윤서준(7번)이 3일째 결석입니다. 전화를 걸자 서준이가 직접 받습니다. '게임 대회 준비 중이에요. 이번 대회 상금이 500만원인데, 학교보다 이게 더 중요해요.' 부모님은 아직 모르는 듯합니다.",
    involvedStudentIds: ["s7"],
    presetChoices: [
      { id: "c1", text: "가정방문하여 학부모와 직접 면담한다.", approach: "professional" },
      { id: "c2", text: "게임 대회를 인정하되, 복귀 조건을 함께 협상한다.", approach: "democratic" },
      { id: "c3", text: "무단결석 규정대로 학교에 보고하고 절차를 밟는다.", approach: "authoritative" },
    ],
  },

  // ═══ s8 임소율: 사이버 폭력 "나만 빼고" ═══
  {
    id: "e_s8_1", weekNumber: 6, triggerStudentId: "s8", weekRange: [4, 10],
    eventType: "bullying", severity: 4,
    title: "\"나만 빼고 다 있더라...\"",
    description: "쉬는 시간에 임소율(8번)이 화장실에서 울고 있는 걸 발견했습니다. 이유를 물으니 '반 단톡방에서 저만 빼고 새 단톡방을 만들었대요. 어제 알았어요. 28명이 다 있는데 저만 없어요...' 소율이는 내일부터 학교 안 나오겠다고 합니다.",
    involvedStudentIds: ["s8"],
    presetChoices: [
      { id: "c1", text: "전체 휴대폰을 수거하고 주동자를 색출해 징계 절차를 밟는다.", approach: "authoritative" },
      { id: "c2", text: "전문 상담교사에게 인계하고 관계 회복 프로그램을 운영한다.", approach: "professional" },
      { id: "c3", text: "학부모들에게 공지하여 가정 지도를 요청한다.", approach: "democratic" },
    ],
  },
  {
    id: "e_s8_2", weekNumber: 14, triggerStudentId: "s8", weekRange: [12, 20],
    prerequisiteEventId: "e_s8_1",
    eventType: "bullying", severity: 4,
    title: "소율이의 등교 거부",
    description: "1차 대응 이후에도 임소율(8번)이 등교를 거부합니다. 어머니에게서 전화가 왔습니다. '소율이가 아침마다 배가 아프다고 하는데, 병원에서는 이상 없대요. 학교에서 무슨 일이 있는 거 아니에요?'",
    involvedStudentIds: ["s8"],
    presetChoices: [
      { id: "c1", text: "가정방문하여 소율이와 직접 대화하고 복귀 계획을 세운다.", approach: "professional" },
      { id: "c2", text: "학교폭력 사안으로 공식 접수하고 가해 학생 조치를 강화한다.", approach: "authoritative" },
      { id: "c3", text: "온라인 수업 참여를 허용하며 점진적 복귀를 지원한다.", approach: "democratic" },
    ],
  },

  // ═══ s9 강도윤: 영재 고립 ═══
  {
    id: "e_s9_1", weekNumber: 7, triggerStudentId: "s9", weekRange: [5, 12],
    eventType: "social", severity: 3,
    title: "\"너희랑 하면 수준이 안 맞아\"",
    description: "조별 과제 시간. 강도윤(9번)이 조원들에게 '이건 이렇게 풀면 안 되는데... 너희랑 하면 수준이 안 맞아'라고 말했습니다. 조원 3명이 손을 들고 항의합니다. '선생님, 도윤이가 우리 무시해요!'",
    involvedStudentIds: ["s9"],
    presetChoices: [
      { id: "c1", text: "도윤이에게 리더 역할을 부여하여 팀을 이끌게 한다.", approach: "democratic" },
      { id: "c2", text: "도윤이만 개별 과제를 주고, 나머지 조를 재편성한다.", approach: "permissive" },
      { id: "c3", text: "협동 능력도 평가 기준임을 전체에 명확히 공지한다.", approach: "authoritative" },
    ],
  },

  // ═══ s10 오하린: 공개적 반항 ═══
  {
    id: "e_s10_1", weekNumber: 5, triggerStudentId: "s10", weekRange: [3, 8],
    eventType: "behavior", severity: 3,
    title: "하린이의 첫 번째 도전",
    description: "교복 착용 규정을 안내하자 오하린(10번)이 손을 들고 말합니다. '선생님, 왜 교복을 입어야 하는지 이유를 모르겠어요. 그냥 옛날 규칙 아니에요?' 다른 학생들이 고개를 끄덕이며 동조합니다.",
    involvedStudentIds: ["s10"],
    presetChoices: [
      { id: "c1", text: "교복 규정의 이유를 논리적으로 설명하고 납득시킨다.", approach: "professional" },
      { id: "c2", text: "좋은 질문이라고 인정하며 학급 토론 주제로 삼는다.", approach: "democratic" },
      { id: "c3", text: "규칙은 규칙이니 따르라고 단호하게 말한다.", approach: "authoritative" },
    ],
  },
  {
    id: "e_s10_2", weekNumber: 12, triggerStudentId: "s10", weekRange: [10, 18],
    prerequisiteEventId: "e_s10_1",
    eventType: "behavior", severity: 5,
    title: "\"선생님이나 잘하세요\"",
    description: "체육 시간에 팀을 배정하자 오하린(10번)이 폭발합니다. '선생님은 맨날 자기 맘대로야! 우리 의견은 안 물어보고! 선생님이나 잘하세요!' 운동장에서 30명 앞에서 소리를 지릅니다. 체육 시간이 완전히 멈췄습니다.",
    involvedStudentIds: ["s10"],
    presetChoices: [
      { id: "c1", text: "즉시 교무실로 데려가 선도위원회에 회부한다.", approach: "authoritative" },
      { id: "c2", text: "수업을 마치고 방과 후에 따로 불러 진심 어린 대화를 시도한다.", approach: "democratic" },
      { id: "c3", text: "유머로 넘기며 '하린이가 오늘 할 말 많네~' 하고 수업을 계속한다.", approach: "permissive" },
    ],
  },

  // ═══ s11 신우진: 가정 학대 의심 ═══
  {
    id: "e_s11_1", weekNumber: 8, triggerStudentId: "s11", weekRange: [6, 14],
    eventType: "mental", severity: 5,
    title: "\"계단에서 떨어졌어요\"",
    description: "체육 시간에 신우진(11번)이 착의를 극도로 거부합니다. 체육복으로 갈아입으라고 하자 화장실에 숨었습니다. 나중에 보건실에서 보건교사가 말합니다. '우진이 팔에 여러 개의 멍이 있어요. 물어보면 계단에서 떨어졌다고만 해요.'",
    involvedStudentIds: ["s11"],
    presetChoices: [
      { id: "c1", text: "아동보호전문기관에 즉시 신고한다. (교사는 의무 신고자)", approach: "professional" },
      { id: "c2", text: "우진이와 신뢰 관계를 먼저 구축한 후 진실을 파악한다.", approach: "democratic" },
      { id: "c3", text: "보건교사에게 인계하여 상처를 기록하고 관찰을 요청한다.", approach: "professional" },
    ],
  },

  // ═══ s12 배지민: 헬리콥터맘 스트레스 ═══
  {
    id: "e_s12_1", weekNumber: 4, triggerStudentId: "s12", weekRange: [3, 10],
    eventType: "parent", severity: 3,
    title: "매일 오시는 어머니",
    description: "배지민(12번) 어머니가 오늘도 학교에 왔습니다. 도시락을 가져다주고, 교실을 기웃거리며 수업을 참관하려 합니다. '선생님, 지민이 학교생활을 제 눈으로 직접 확인해야 안심이 돼요. 수업 참관 좀 할게요.' 지민이는 고개를 푹 숙이고 있습니다.",
    involvedStudentIds: ["s12"],
    presetChoices: [
      { id: "c1", text: "학교 방문 규정을 안내하며 정중하지만 단호하게 제한한다.", approach: "professional" },
      { id: "c2", text: "주 1회 참관을 허용하되 나머지는 알림장으로 대체하자고 제안한다.", approach: "democratic" },
      { id: "c3", text: "지민이의 자립심을 키우기 위한 학부모 상담을 제안한다.", approach: "democratic" },
    ],
  },

  // ═══ s13 조현우: 다문화 갈등 ═══
  {
    id: "e_s13_1", weekNumber: 7, triggerStudentId: "s13", weekRange: [5, 12],
    eventType: "special", severity: 4,
    title: "\"쟤랑 하면 우리 점수 깎여요\"",
    description: "조별 과제 편성을 발표하자 한 조에서 노골적인 거부가 나옵니다. '선생님, 현우랑 같은 조 하기 싫어요. 쟤랑 하면 우리 점수 깎이잖아요.' 조현우(13번)가 울면서 혼자 교실 구석으로 갑니다.",
    involvedStudentIds: ["s13"],
    presetChoices: [
      { id: "c1", text: "점수 가산점을 부여하겠다며 해당 조에 강제 배정한다.", approach: "authoritative" },
      { id: "c2", text: "현우에게만 따로 수행할 수 있는 대체 과제를 준다.", approach: "permissive" },
      { id: "c3", text: "다문화 이해 교육 수업을 긴급 편성한다.", approach: "democratic" },
    ],
  },
  {
    id: "e_s13_2", weekNumber: 16, triggerStudentId: "s13", weekRange: [13, 22],
    prerequisiteEventId: "e_s13_1",
    eventType: "parent", severity: 4,
    title: "수업참관일의 눈물",
    description: "수업 참관일에 현우의 어머니가 오셨습니다. 한국어가 서툰 어머니가 인사하자 뒤에서 학생들의 킥킥거리는 소리가 들립니다. 현우가 어머니 손을 뿌리치며 '엄마 왜 왔어!'라고 소리칩니다. 어머니의 눈에 눈물이 고입니다.",
    involvedStudentIds: ["s13"],
    presetChoices: [
      { id: "c1", text: "즉시 웃음소리를 멈추게 하고, 다양한 문화 존중에 대해 단호하게 이야기한다.", approach: "authoritative" },
      { id: "c2", text: "현우와 어머니를 따로 모시고 대화하며 현우의 마음을 어루만진다.", approach: "professional" },
      { id: "c3", text: "어머니에게 한국어 교실 프로그램을 안내하며 학교 참여를 지원한다.", approach: "democratic" },
    ],
  },

  // ═══ s14 류채원: 숨은 재능 + 사회불안 ═══
  {
    id: "e_s14_1", weekNumber: 6, triggerStudentId: "s14", weekRange: [4, 10],
    eventType: "academic", severity: 2,
    title: "떨리는 발표, 놀라운 재능",
    description: "미술 시간에 류채원(14번)이 놀라운 그림 실력을 보였습니다. 감탄한 나머지 앞에 나와서 설명해달라고 했더니, 채원이가 온몸을 떨며 과호흡을 시작합니다. 반 아이들이 놀라서 웅성거리고, 채원이는 얼굴을 감싸며 주저앉았습니다.",
    involvedStudentIds: ["s14"],
    presetChoices: [
      { id: "c1", text: "발표 대신 작품 전시로 대체하여 채원이의 자존감을 세운다.", approach: "democratic" },
      { id: "c2", text: "채원이에게 1:1로 발표 연습 기회를 제공한다.", approach: "professional" },
      { id: "c3", text: "모든 학생에게 발표 의무화, 예외 없음 원칙을 적용한다.", approach: "authoritative" },
    ],
  },

  // ═══ s15 남시우: 심리 위기 "죽고 싶어요" ═══
  {
    id: "e_s15_1", weekNumber: 10, triggerStudentId: "s15", weekRange: [8, 16],
    eventType: "mental", severity: 5,
    title: "\"죽고 싶어요\"",
    description: "노트 검사를 하다가 남시우(15번)의 일기장을 발견했습니다. 펼쳐보니 '죽고 싶어요', '아무도 나를 필요로 하지 않아요', '할머니한테 짐이 되고 싶지 않아요'가 반복적으로 적혀있습니다. 시우는 오늘도 점심을 굶고 있었습니다.",
    involvedStudentIds: ["s15"],
    presetChoices: [
      { id: "c1", text: "할머니의 반대에도 불구하고 외부 전문기관에 즉시 신고하고 연계한다.", approach: "professional" },
      { id: "c2", text: "교사가 매일 시우를 상담하며 밀착 케어한다.", approach: "democratic" },
      { id: "c3", text: "일단 모르는 척 지켜보며 시우의 반응을 살핀다.", approach: "permissive" },
    ],
  },
  {
    id: "e_s15_2", weekNumber: 20, triggerStudentId: "s15", weekRange: [17, 25],
    prerequisiteEventId: "e_s15_1",
    eventType: "mental", severity: 5,
    title: "시우의 결석, 그리고 편지",
    description: "남시우(15번)가 일주일째 결석입니다. 할머니에게 전화하니 '시우가 방에서 안 나와요. 밥도 안 먹어요.' 책상 서랍에서 시우가 쓴 편지를 발견합니다. '선생님, 저 때문에 신경 쓰지 마세요. 죄송해요.'",
    involvedStudentIds: ["s15"],
    presetChoices: [
      { id: "c1", text: "자살예방센터(1393)에 즉시 연락하고, 가정방문과 함께 긴급 개입한다.", approach: "professional" },
      { id: "c2", text: "직접 가정방문하여 시우와 할머니를 만나고, 복지 연계를 시작한다.", approach: "democratic" },
      { id: "c3", text: "학교 관리자에게 보고하고, 학교 차원의 위기 대응팀을 구성한다.", approach: "authoritative" },
    ],
  },

  // ═══ 연쇄 이벤트: s3 × s1 ═══
  {
    id: "e_cross_1", weekNumber: 18, triggerStudentId: "s3", weekRange: [15, 25],
    prerequisiteEventId: "e_s1_1",
    eventType: "social", severity: 4,
    title: "학원 가방을 숨긴 지호",
    description: "박지호(3번)가 김민준(1번)의 학원 가방을 사물함에 숨겼습니다. '학원 빠지면 되잖아, 같이 놀자!'라고 웃지만, 민준이가 울면서 고백합니다. '학원 안 가면 엄마한테 맞아요...' 교실이 조용해집니다.",
    involvedStudentIds: ["s3", "s1"],
    presetChoices: [
      { id: "c1", text: "양쪽 학부모 모두 면담하고 아동 복지 점검을 요청한다.", approach: "professional" },
      { id: "c2", text: "지호에게 훈육하고 민준이 보호 조치를 분리 대응한다.", approach: "authoritative" },
      { id: "c3", text: "학급 전체에 '친구의 사정 이해하기' 수업을 실시한다.", approach: "democratic" },
    ],
  },
];

// ── 선택지별 결과 매핑 ──
export const MOCK_OUTCOMES: Record<string, Record<string, MockOutcome>> = {
  // s1 김민준: 학업 압박
  e_s1_1: {
    c1: { narrative: "학부모 면담에서 어머니가 방어적으로 나왔습니다. '다 민준이 미래를 위한 건데요.' 하지만 민준이의 수면 시간 데이터를 보여주자 조금 흔들리는 모습입니다. 학원 2개를 줄이겠다는 약속을 받아냈습니다.",
      resourceChanges: { studentTrust: 5, parentSatisfaction: -10, schoolReputation: 5, teacherEnergy: -10 },
      mentorFeedback: "근본적인 해결을 시도한 좋은 접근입니다. 학부모 반발이 있지만, 아이의 건강을 최우선에 둔 판단입니다." },
    c2: { narrative: "민준이가 쉬는 시간 낮잠 허용에 기뻐합니다. 하지만 학부모에게 알려지면서 '학교에서 아이를 재우냐'는 항의가 들어왔습니다. 다른 학생들도 '저도 자도 돼요?'라며 혼란스러워합니다.",
      resourceChanges: { studentTrust: 10, parentSatisfaction: -5, schoolReputation: -5, teacherEnergy: -5 },
      mentorFeedback: "학생에게 공감을 보인 건 좋았지만, 근본적 해결 없이 임시 조치만으로는 한계가 있습니다." },
    c3: { narrative: "민준이가 고개를 숙이며 '네, 알겠습니다'라고 했지만, 쉬는 시간에 친구에게 '선생님도 엄마랑 똑같아'라고 말하는 게 들립니다. 이후 민준이가 교사를 피하기 시작합니다.",
      resourceChanges: { studentTrust: -5, parentSatisfaction: 5, schoolReputation: 5, teacherEnergy: 5 },
      mentorFeedback: "원칙적 대응이지만, 이미 힘든 학생에게 추가 압박이 되었습니다. 원인을 먼저 이해하는 과정이 필요합니다." },
  },

  // s2 이서윤: 학부모 민원
  e_s2_1: {
    c1: { narrative: "어머니가 '역시 선생님이 이해해주시는군요'라며 만족합니다. 하지만 다음 날 서윤이를 지나치게 조심하게 되면서, 수업 중 서윤이의 실수를 지적하지 못합니다. 다른 학생들이 '서윤이만 특별 대우받는다'고 수군거립니다.",
      resourceChanges: { studentTrust: -5, parentSatisfaction: 10, schoolReputation: 0, teacherEnergy: -10 },
      mentorFeedback: "학부모 만족도는 올랐지만, 교육적 균형이 깨졌습니다. 밤 10시 카톡에 즉시 응답하는 것 자체가 근무시간 경계를 허무는 위험한 선례입니다." },
    c2: { narrative: "어머니가 '학교 일과 시간이라니, 제 아이가 지금 울고 있는데 그게 중요한가요?'라며 더 화를 냅니다. 하지만 다음 날 냉정해진 후 학교로 전화를 다시 걸어왔고, 차분한 대화가 이루어졌습니다.",
      resourceChanges: { studentTrust: 0, parentSatisfaction: -10, schoolReputation: 5, teacherEnergy: 5 },
      mentorFeedback: "교사의 근무시간 경계를 지킨 원칙적 대응입니다. 단기적으로 학부모 불만이 있지만, 장기적으로 건강한 관계를 만듭니다." },
    c3: { narrative: "교육청 가이드라인을 보낸 후 어머니가 '교사가 행정적으로만 대응하면 되겠습니까?'라며 교육청에 실제로 민원을 넣었습니다. 교장실에서 호출이 왔습니다.",
      resourceChanges: { studentTrust: 5, parentSatisfaction: -15, schoolReputation: 5, teacherEnergy: 5 },
      mentorFeedback: "법적으로 정당하지만, 감정적으로 격앙된 학부모에게 문서를 보내는 것은 대결 구도를 만듭니다. 공감 후 원칙을 제시하는 순서가 효과적입니다." },
  },

  // s3 박지호: 교실 붕괴
  e_s3_2: {
    c1: { narrative: "지호를 교실 밖으로 내보냈습니다. 반 아이들 사이에서 '선생님 무섭다'와 '잘했다' 의견이 갈립니다. 선도위원회에서 지호에게 봉사활동 10시간이 결정되었습니다. 지호 아버지에게서 '아들 망치려고 작정했냐'는 전화가 왔습니다.",
      resourceChanges: { studentTrust: -5, parentSatisfaction: 5, schoolReputation: 10, teacherEnergy: -10 },
      mentorFeedback: "학급 질서를 지킨 건 맞지만, 공개적 반항의 이면에 있는 아이의 심리를 놓쳤습니다. 징계 후 반드시 관계 회복이 필요합니다." },
    c2: { narrative: "수업을 마치고 지호를 불렀습니다. 처음엔 반항하던 지호가 '아무도 저한테 관심 없잖아요. 집에서도 학교에서도...'라며 눈물을 보였습니다. 진심으로 대화하자 지호의 태도가 조금씩 부드러워졌습니다. 하지만 에너지가 많이 소모되었습니다.",
      resourceChanges: { studentTrust: 10, parentSatisfaction: 0, schoolReputation: -5, teacherEnergy: -20 },
      mentorFeedback: "공감적 접근이 학생의 마음을 연 좋은 사례입니다. 다만, 수업 중 공개적 무시가 방치되면 다른 학생들의 모방 위험이 있습니다." },
    c3: { narrative: "'하하, 지호 오늘 에너지가 넘치네~' 반 아이들이 웃었지만, 지호는 '지금 놀리는 거예요?'라며 더 화를 냈습니다. 수업은 계속되었지만, 이후 지호가 더 대담하게 반항하기 시작합니다. 교사의 권위가 흔들렸습니다.",
      resourceChanges: { studentTrust: 5, parentSatisfaction: 0, schoolReputation: -5, teacherEnergy: 5 },
      mentorFeedback: "유머가 통하는 경우도 있지만, 이번 상황에서는 학생의 감정을 경시한 것으로 받아들여졌습니다. 상황의 심각도를 읽는 것이 중요합니다." },
  },

  // s8 임소율: 사이버 폭력
  e_s8_1: {
    c1: { narrative: "휴대폰 수거에 학생들이 크게 반발합니다. '왜 우리 다 뺏어요!' 주동자를 찾았지만 증거 확보가 어렵습니다. 학부모들에게서 '사생활 침해'라는 항의가 쏟아졌습니다. 소율이는 '더 큰일 났다'며 등교를 거부합니다.",
      resourceChanges: { studentTrust: -10, parentSatisfaction: 5, schoolReputation: 10, teacherEnergy: -5 },
      mentorFeedback: "단호한 조치지만 부작용이 컸습니다. 사이버 폭력은 증거 확보가 먼저이며, 전체 처벌보다 가해자 특정이 우선입니다." },
    c2: { narrative: "상담교사에게 인계하고, 소율이와 가해 학생들 각각 상담이 시작되었습니다. 관계 회복 프로그램(회복적 정의 서클)을 2주간 운영했습니다. 시간이 오래 걸렸지만, 소율이가 다시 웃기 시작했습니다.",
      resourceChanges: { studentTrust: 10, parentSatisfaction: 5, schoolReputation: 5, teacherEnergy: -15 },
      mentorFeedback: "전문가 연계와 체계적 프로그램 운영이 효과적이었습니다. 교사 에너지 소모가 크지만 가장 교육적인 접근입니다." },
    c3: { narrative: "학부모 공지 후, 가해 학생 부모가 '우리 애가 그럴 리 없다'며 부인합니다. 소율이 어머니는 '학교에서 해결해야지 왜 가정에 떠넘기나'라며 불만을 표합니다. 상황이 더 복잡해졌습니다.",
      resourceChanges: { studentTrust: 0, parentSatisfaction: 10, schoolReputation: 0, teacherEnergy: -5 },
      mentorFeedback: "가정 지도 요청은 보충 수단이지 주된 해결책이 아닙니다. 학교 내 대응을 병행해야 합니다." },
  },

  // s15 남시우: 심리 위기
  e_s15_1: {
    c1: { narrative: "전문기관에 연계했습니다. 할머니가 '집안 망신시키려고'라며 강하게 반발했지만, 정신건강 전문가가 시우를 면담한 후 '조기 개입이 정말 중요한 시점'이라고 말했습니다. 시우는 주 2회 상담을 시작했고, 점심 지원도 연결되었습니다.",
      resourceChanges: { studentTrust: 10, parentSatisfaction: -20, schoolReputation: 10, teacherEnergy: -10 },
      mentorFeedback: "가장 올바른 대응입니다. 학부모(보호자)의 반대가 있어도 아이의 생명과 안전이 최우선입니다. 의무 신고자로서 법적 의무도 수행했습니다." },
    c2: { narrative: "매일 시우와 10분씩 상담합니다. 시우가 조금씩 마음을 열어 '할머니가 아파서 제가 짐이 돼요'라고 고백했습니다. 하지만 교사 혼자 감당하기엔 너무 무거운 케이스입니다. 교사의 에너지가 급격히 떨어집니다.",
      resourceChanges: { studentTrust: 5, parentSatisfaction: 0, schoolReputation: 0, teacherEnergy: -25 },
      mentorFeedback: "교사의 진심은 학생에게 전달되지만, 자살 위험이 있는 학생을 교사 혼자 케어하는 것은 위험합니다. 반드시 전문가 연계가 필요합니다." },
    c3: { narrative: "지켜보기로 했습니다. 2주 후, 시우의 일기장에 더 심각한 내용이 적혀있습니다. '내일이면 끝날 거야.' 즉시 조치가 필요합니다.",
      resourceChanges: { studentTrust: -10, parentSatisfaction: 0, schoolReputation: -10, teacherEnergy: 0 },
      mentorFeedback: "절대 해서는 안 되는 선택입니다. 자살 징후를 발견하고 방치하는 것은 교사의 의무 위반이며, 학생의 생명을 위험에 빠뜨립니다.",
      triggersGameover: true,
      gameoverDelay: 3,
    },
  },

  // s10 오하린: 공개적 반항
  e_s10_2: {
    c1: { narrative: "하린이를 교무실로 데려갔습니다. 선도위원회에서 서면 경고를 받았습니다. 하린이 부모가 '우리 집은 원래 자유로운 분위기'라며 학교의 권위주의를 비판합니다. 하린이는 더 닫혀버렸습니다.",
      resourceChanges: { studentTrust: -5, parentSatisfaction: 5, schoolReputation: 10, teacherEnergy: -10 },
      mentorFeedback: "공식 절차를 밟았지만, 하린이의 반항 이면의 목소리를 놓쳤습니다. 징계 후에도 대화가 필요합니다." },
    c2: { narrative: "방과 후 하린이와 대화를 나눴습니다. '선생님이 맨날 우리 의견 안 물어보잖아요'라는 불만 속에 합리적인 요구가 있었습니다. 앞으로 중요한 결정은 학급 회의를 통해 정하기로 약속했습니다.",
      resourceChanges: { studentTrust: 10, parentSatisfaction: 0, schoolReputation: -5, teacherEnergy: -20 },
      mentorFeedback: "에너지가 많이 들지만 가장 교육적인 접근입니다. 반항하는 학생의 진짜 목소리를 들었습니다." },
    c3: { narrative: "'하린이가 오늘 할 말 많네~' 반 아이들이 웃었고 분위기는 넘어갔습니다. 하지만 하린이가 '선생님이 저를 무시했다'고 느꼈고, 이후 수업에 아예 참여하지 않기 시작합니다.",
      resourceChanges: { studentTrust: 5, parentSatisfaction: 0, schoolReputation: -5, teacherEnergy: 5 },
      mentorFeedback: "일시적으로 넘겼지만 근본적 해결이 아닙니다. 학생은 무시당했다고 느꼈고, 관계가 악화될 수 있습니다." },
  },

  // s6 한예은: 자해 의심
  e_s6_1: {
    c1: { narrative: "Wee클래스 상담교사가 예은이와 면담했습니다. 예은이가 처음엔 부인했지만, 결국 '성적이 떨어지면 살 가치가 없는 것 같아요'라고 털어놓았습니다. 부모에게 연락하자 어머니가 '성적 때문에 이러는 거면 더 공부시켜야지'라는 충격적인 반응을 보였습니다.",
      resourceChanges: { studentTrust: 5, parentSatisfaction: -10, schoolReputation: 10, teacherEnergy: -10 },
      mentorFeedback: "전문가 연계는 올바른 선택입니다. 학부모의 반응이 문제의 원인을 보여줍니다. 추가 학부모 상담이 필요합니다." },
    c2: { narrative: "예은이와 조심스럽게 대화했습니다. '선생님, 저 바보 같아요. 1등 못하면 아무 가치도 없는 것 같아요.' 예은이가 울면서 자신의 힘든 점을 이야기했습니다. 신뢰가 쌓였지만, 전문적 개입이 지연되고 있습니다.",
      resourceChanges: { studentTrust: 10, parentSatisfaction: 0, schoolReputation: 0, teacherEnergy: -20 },
      mentorFeedback: "공감적 접근이 좋았지만, 자해가 확인된 상황에서는 전문가 연계가 우선입니다. 교사 상담만으로는 한계가 있습니다." },
    c3: { narrative: "수행평가 가산점을 줬습니다. 예은이의 성적은 유지됐지만, 근본적인 자해 원인은 해결되지 않았습니다. 2주 후 상처 자국이 더 늘어난 것을 발견합니다.",
      resourceChanges: { studentTrust: 0, parentSatisfaction: 5, schoolReputation: -10, teacherEnergy: 0 },
      mentorFeedback: "증상만 가린 대응입니다. 자해 징후 발견 시 반드시 전문 기관에 연계해야 합니다. 성적 문제는 원인이 아니라 촉발제입니다.",
      triggersGameover: true,
      gameoverDelay: 4,
    },
  },

  // s11 신우진: 가정 학대
  e_s11_1: {
    c1: { narrative: "아동보호전문기관에 신고했습니다. 조사관이 방문하여 우진이 아버지를 면담했습니다. 아버지가 크게 화를 내며 '집안일에 왜 끼어들어'라고 학교에 항의했습니다. 하지만 조사 결과 정서적 학대가 인정되어 상담이 의무화되었습니다.",
      resourceChanges: { studentTrust: 5, parentSatisfaction: -20, schoolReputation: 10, teacherEnergy: -10 },
      mentorFeedback: "교사의 의무 신고를 정확히 수행했습니다. 학대 의심 시 교사는 반드시 신고해야 하며, 미신고 시 과태료 등 법적 책임이 있습니다." },
    c2: { narrative: "우진이와 천천히 대화를 시도했습니다. 하지만 우진이는 입을 열지 않습니다. 2주가 지나는 동안 새로운 멍이 생겼고, 체육 시간에 우진이가 쓰러져 병원에 갔습니다. 의사가 아동학대 의심 신고를 했습니다.",
      resourceChanges: { studentTrust: 10, parentSatisfaction: 0, schoolReputation: 0, teacherEnergy: -20 },
      mentorFeedback: "신뢰 구축은 중요하지만, 학대 의심 상황에서 시간을 끄는 것은 위험합니다. 의무 신고 후에 신뢰 관계를 만들어도 됩니다." },
    c3: { narrative: "보건교사가 상처를 기록하고 관찰을 시작했습니다. 체계적인 증거가 모이면서 아동보호기관 신고의 근거가 탄탄해졌습니다. 다만 관찰 기간 중 우진이가 추가로 다친 흔적이 발견되어 마음이 무거워졌습니다.",
      resourceChanges: { studentTrust: 5, parentSatisfaction: -5, schoolReputation: 5, teacherEnergy: -5 },
      mentorFeedback: "증거 확보를 병행한 접근이지만, 관찰 중에도 신고 의무는 즉시 이행해야 합니다. 기록과 신고를 동시에 진행하는 것이 바람직합니다." },
  },

  // s13 조현우: 다문화 갈등
  e_s13_1: {
    c1: { narrative: "현우를 해당 조에 배정하고 가산점을 약속했습니다. 조원들은 불만이지만 따릅니다. 그러나 현우에게 '너 때문에 가산점 받는 거다'라는 말이 오가며, 현우가 더 위축됩니다.",
      resourceChanges: { studentTrust: -5, parentSatisfaction: 5, schoolReputation: 0, teacherEnergy: 5 },
      mentorFeedback: "강제 배정은 표면적 해결이지만, 인식 변화 없이는 2차 피해가 발생합니다. 인식 개선이 먼저입니다." },
    c2: { narrative: "현우에게 개별 과제를 주었습니다. 현우는 혼자 열심히 했지만, '나는 같이 못 하는 아이'라는 낙인이 더 강화되었습니다. 현우 어머니에게서 전화가 왔습니다. '학교에서도 우리 아이를 따로 두는 건가요?'",
      resourceChanges: { studentTrust: 0, parentSatisfaction: 0, schoolReputation: -5, teacherEnergy: 5 },
      mentorFeedback: "분리 대응은 소외를 강화합니다. 함께할 수 있는 환경을 만드는 것이 교육적 접근입니다." },
    c3: { narrative: "2시간짜리 다문화 이해 교육을 편성했습니다. 처음엔 시큰둥하던 학생들이 베트남 음식 만들기 체험에서 즐거워했습니다. 현우가 어머니의 베트남 요리를 소개하며 처음으로 밝게 웃었습니다. 하지만 수업 진도가 밀렸습니다.",
      resourceChanges: { studentTrust: 10, parentSatisfaction: 5, schoolReputation: 5, teacherEnergy: -15 },
      mentorFeedback: "인식 개선의 가장 효과적인 방법입니다. 진도 밀림은 단기적 비용이지만, 학급 문화 개선은 장기적 투자입니다." },
  },
};

// ── 기본 결과 ──
export function getDefaultOutcome(choiceApproach: string): MockOutcome {
  switch (choiceApproach) {
    case "authoritative":
      return {
        narrative: "단호한 조치를 취했습니다. 학생들은 규칙의 중요성을 인식했지만, 일부는 긴장하는 모습입니다.",
        resourceChanges: { studentTrust: -2, parentSatisfaction: 2, schoolReputation: 3, teacherEnergy: -5 },
        mentorFeedback: "단호한 대응이 필요한 상황이었습니다. 이후 개별적으로 학생의 감정을 확인해주면 신뢰 회복에 도움이 됩니다.",
      };
    case "democratic":
      return {
        narrative: "학생들의 의견을 들으며 함께 해결책을 찾았습니다. 시간이 걸렸지만 학생들은 만족스러운 표정입니다.",
        resourceChanges: { studentTrust: 4, parentSatisfaction: 1, schoolReputation: 1, teacherEnergy: -8 },
        mentorFeedback: "학생 참여를 이끌어낸 좋은 접근입니다. 장기적으로 학급 자치력이 높아집니다.",
      };
    case "permissive":
      return {
        narrative: "학생의 요구를 수용했습니다. 해당 학생은 기뻐했지만, 다른 학생들이 형평성에 의문을 제기할 수 있습니다.",
        resourceChanges: { studentTrust: 0, parentSatisfaction: -1, schoolReputation: -2, teacherEnergy: -3 },
        mentorFeedback: "유연한 대응이지만, 일관된 기준이 없으면 혼란이 올 수 있습니다.",
      };
    case "professional":
    default:
      return {
        narrative: "전문적인 절차에 따라 차분하게 대응했습니다. 학생들은 선생님의 침착한 모습에 안심한 듯합니다.",
        resourceChanges: { studentTrust: 3, parentSatisfaction: 3, schoolReputation: 3, teacherEnergy: -7 },
        mentorFeedback: "교과서적이지만 안정적인 대응입니다. 상황에 따라 감정적 공감을 더해주면 유대가 깊어집니다.",
      };
  }
}
