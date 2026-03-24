import type { EventCategory, PresetChoice } from "@/types";

export interface MockEvent {
  id: string;
  weekNumber: number;
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
}

// 주차별 더미 이벤트 풀
export const MOCK_EVENTS: MockEvent[] = [
  {
    id: "e1",
    weekNumber: 1,
    eventType: "class_mgmt",
    severity: 1,
    title: "첫 주 자리 배치 불만",
    description: "학기 첫 주, 자리 배치를 발표하자 김민준(1번)이 \"선생님 저 왜 맨 앞이에요!\"라고 큰 소리로 불만을 표합니다. 몇몇 학생들이 따라서 웅성거리기 시작합니다.",
    involvedStudentIds: ["s1", "s3"],
    presetChoices: [
      { id: "c1", text: "\"자리는 공정하게 추첨한 거야. 한 달 후에 바꿀게.\"", approach: "authoritative" },
      { id: "c2", text: "\"왜 그 자리가 싫은지 이유를 들어볼게.\"", approach: "democratic" },
      { id: "c3", text: "\"그럼 원하는 자리가 있으면 말해봐.\"", approach: "permissive" },
      { id: "c4", text: "\"자리 배치 기준을 설명하고, 자리 교체 규칙을 함께 정하자.\"", approach: "professional" },
    ],
  },
  {
    id: "e2",
    weekNumber: 2,
    eventType: "behavior",
    severity: 1,
    title: "수업 중 떠드는 학생",
    description: "수학 시간, 박지호(3번)가 옆자리 친구와 계속 속닥거리며 떠들고 있습니다. 주변 학생 2-3명도 점점 집중력을 잃어가고 있습니다. 한예은(6번)이 짜증스러운 표정으로 뒤를 돌아봅니다.",
    involvedStudentIds: ["s3", "s6"],
    presetChoices: [
      { id: "c1", text: "\"박지호, 이름 부르고 조용히 하라고 경고한다.\"", approach: "authoritative" },
      { id: "c2", text: "\"잠깐, 다 같이 집중 한 번 하고 가자. 스트레칭 타임!\"", approach: "democratic" },
      { id: "c3", text: "\"수업 후에 박지호와 따로 이야기한다.\"", approach: "professional" },
      { id: "c4", text: "\"무시하고 수업을 계속 진행한다.\"", approach: "permissive" },
    ],
  },
  {
    id: "e3",
    weekNumber: 3,
    eventType: "social",
    severity: 2,
    title: "전학생 적응 문제",
    description: "피터 김(29번)이 쉬는 시간마다 혼자 앉아있습니다. 아이들이 \"얘 한국말 잘 못해ㅋㅋ\"라고 수군거리는 게 들립니다. 피터가 고개를 숙이고 핸드폰만 보고 있습니다.",
    involvedStudentIds: ["s29", "s22", "s18"],
    presetChoices: [
      { id: "c1", text: "\"반 전체에게 서로 다른 배경을 존중하자는 이야기를 한다.\"", approach: "democratic" },
      { id: "c2", text: "\"피터 옆에 사교적인 학생을 짝으로 앉힌다.\"", approach: "professional" },
      { id: "c3", text: "\"피터에게 개별적으로 다가가 영어로 안부를 묻는다.\"", approach: "democratic" },
      { id: "c4", text: "\"수군거린 학생들을 불러 주의를 준다.\"", approach: "authoritative" },
    ],
  },
  {
    id: "e4",
    weekNumber: 4,
    eventType: "academic",
    severity: 2,
    title: "시험 중 커닝 의심",
    description: "중간 확인 테스트 중, 은찬(25번)이 앞자리 준혁(21번)의 답안지를 자꾸 훔쳐보는 것 같습니다. 확실하지는 않지만 고개를 앞으로 빼는 동작이 여러 번 포착되었습니다.",
    involvedStudentIds: ["s25", "s21"],
    presetChoices: [
      { id: "c1", text: "\"은찬이 옆으로 가서 조용히 '시선 앞으로'라고 말한다.\"", approach: "professional" },
      { id: "c2", text: "\"시험 후 은찬을 불러 직접 물어본다.\"", approach: "democratic" },
      { id: "c3", text: "\"전체에게 '앞만 보세요'라고 공지한다.\"", approach: "authoritative" },
      { id: "c4", text: "\"증거가 확실하지 않으니 일단 지켜본다.\"", approach: "permissive" },
    ],
  },
  {
    id: "e5",
    weekNumber: 5,
    eventType: "bullying",
    severity: 3,
    title: "단톡방 왕따 정황",
    description: "임소율(8번)이 쉬는 시간에 울고 있는 걸 발견했습니다. 물어보니 \"반 단톡방에서 자기만 빼고 새 단톡방을 만들었대요\"라고 말합니다. 확인해보니 백서영(22번)이 주도한 것 같습니다.",
    involvedStudentIds: ["s8", "s22", "s18"],
    presetChoices: [
      { id: "c1", text: "\"소율이를 달래고, 서영이와 나윤이를 따로 불러 이야기를 듣는다.\"", approach: "professional" },
      { id: "c2", text: "\"학교폭력 사안으로 접수하고 절차에 따라 처리한다.\"", approach: "authoritative" },
      { id: "c3", text: "\"학급 회의를 열어 온라인 예절에 대해 토론한다.\"", approach: "democratic" },
      { id: "c4", text: "\"소율이와 개별 상담 후, 서영이에게도 개별 상담을 진행한다.\"", approach: "professional" },
    ],
  },
  {
    id: "e6",
    weekNumber: 6,
    eventType: "parent",
    severity: 3,
    title: "학부모 항의 전화",
    description: "이서윤(2번) 어머니에게서 전화가 왔습니다. \"우리 서윤이가 수학 시간에 질문했는데 선생님이 무시했다고 하더라고요. 어떻게 된 거예요?\" 실제로는 수업 흐름상 잠시 후에 답변하려 했던 상황입니다.",
    involvedStudentIds: ["s2"],
    presetChoices: [
      { id: "c1", text: "\"죄송합니다. 수업 중이라 바로 답변 못 드린 건데, 서윤이에게 먼저 사과하겠습니다.\"", approach: "permissive" },
      { id: "c2", text: "\"그런 상황이 있었군요. 수업 흐름상 잠시 후 답변하려 한 것인데, 서윤이가 오해한 것 같습니다. 내일 서윤이와 이야기해보겠습니다.\"", approach: "professional" },
      { id: "c3", text: "\"학부모님의 걱정을 이해합니다. 학부모 상담을 잡아서 자세히 이야기 나눠볼까요?\"", approach: "democratic" },
      { id: "c4", text: "\"수업 중에 모든 질문에 바로 답하기 어려울 수 있습니다. 서윤이에게 기다려달라고 이야기해주세요.\"", approach: "authoritative" },
    ],
  },
  {
    id: "e7",
    weekNumber: 7,
    eventType: "mental",
    severity: 4,
    title: "학생 심리 위기 징후",
    description: "이수빈(30번)의 일기장을 검사하던 중, \"아무도 나를 신경쓰지 않는다\", \"이 세상에서 사라져도 아무도 모를 것 같다\"는 내용을 발견했습니다. 최근 결석도 2번 있었습니다.",
    involvedStudentIds: ["s30"],
    presetChoices: [
      { id: "c1", text: "\"수빈이와 조용한 곳에서 1:1 상담을 한다. '요즘 힘든 일 있니?'\"", approach: "professional" },
      { id: "c2", text: "\"즉시 학교 상담교사에게 연계하고, 부모님에게도 연락한다.\"", approach: "authoritative" },
      { id: "c3", text: "\"수빈이를 관찰하면서 자연스럽게 다가가는 기회를 만든다. (짝활동 등)\"", approach: "democratic" },
      { id: "c4", text: "\"상담교사 연계 + 수빈이 개별 상담 + 반 아이들에게 수빈이를 자연스럽게 포함시키는 활동 기획\"", approach: "professional" },
    ],
  },
  {
    id: "e8",
    weekNumber: 8,
    eventType: "special",
    severity: 4,
    title: "다문화 학생 차별 발언",
    description: "체육 시간 팀 나누기에서, 한 학생이 조현우(13번)를 가리키며 \"쟤네 엄마 외국인이잖아, 다른 팀으로 가\"라고 말했습니다. 현우의 표정이 굳었고, 주변이 조용해졌습니다.",
    involvedStudentIds: ["s13", "s19", "s3"],
    presetChoices: [
      { id: "c1", text: "\"즉시 수업을 멈추고, 차별 발언이 왜 문제인지 전체에게 단호하게 이야기한다.\"", approach: "authoritative" },
      { id: "c2", text: "\"발언한 학생을 따로 불러 이야기하고, 현우에게는 개별적으로 위로한다.\"", approach: "professional" },
      { id: "c3", text: "\"이번 주 학급 회의 주제를 '다양성 존중'으로 정하고 함께 토론한다.\"", approach: "democratic" },
      { id: "c4", text: "\"발언한 학생에게 사과하게 하고, 학부모에게도 연락한다.\"", approach: "authoritative" },
    ],
  },
];

// 선택지별 더미 결과
export const MOCK_OUTCOMES: Record<string, Record<string, MockOutcome>> = {
  e1: {
    c1: {
      narrative: "김민준이 입을 삐죽거렸지만 한 달이라는 약속에 수긍했습니다. 다른 학생들도 규칙이 정해지자 조용해졌습니다. 하지만 민준이가 뒤에서 \"선생님 너무 딱딱해\"라고 친구들에게 말하는 게 들립니다.",
      resourceChanges: { studentTrust: -3, parentSatisfaction: 0, schoolReputation: 2, teacherEnergy: -5 },
      mentorFeedback: "규칙을 명확히 한 것은 좋았습니다. 다만, 학생의 불만 이유를 먼저 들어보는 과정이 있었으면 학생 신뢰도가 더 높았을 거예요. 첫 주에 교사의 일관성을 보여준 건 장기적으로 긍정적입니다.",
    },
    c2: {
      narrative: "민준이가 \"앞자리는 칠판 반사가 눈부셔요\"라고 말합니다. 합리적인 이유네요. 커튼 위치를 조절해주겠다고 하자 민준이가 \"감사합니다!\"라며 밝아졌습니다. 다른 학생들도 \"선생님 말 들어주시는구나\"라는 표정입니다.",
      resourceChanges: { studentTrust: 5, parentSatisfaction: 2, schoolReputation: 0, teacherEnergy: -3 },
      mentorFeedback: "훌륭한 대응이었습니다. 학생의 이유를 들어본 것이 신뢰 형성에 큰 도움이 됩니다. 첫 주에 '선생님은 말을 들어주는 분'이라는 인상을 준 것은 매우 긍정적입니다.",
    },
    c3: {
      narrative: "민준이가 신나서 친구들 옆자리를 골랐습니다. 하지만 다른 학생들도 \"저도 옮기고 싶어요!\"라고 난리가 났고, 교실이 한동안 소란스러워졌습니다. 결국 원래대로 돌려야 했고, 학생들이 실망한 표정입니다.",
      resourceChanges: { studentTrust: -5, parentSatisfaction: 0, schoolReputation: -3, teacherEnergy: -8 },
      mentorFeedback: "학생의 요구를 바로 수용하는 것은 유연해 보이지만, 다른 학생들의 형평성 문제를 일으킬 수 있습니다. 규칙을 먼저 세우고 그 안에서 유연성을 발휘하는 것이 좋습니다.",
    },
    c4: {
      narrative: "자리 배치 기준(시력, 키, 학습 스타일)을 설명하고, 앞으로 한 달마다 반 회의에서 교체 여부를 정하자고 제안했습니다. 학생들이 고개를 끄덕이며 수긍합니다. 민준이도 \"한 달만 참을게요\"라며 납득했습니다.",
      resourceChanges: { studentTrust: 3, parentSatisfaction: 3, schoolReputation: 2, teacherEnergy: -5 },
      mentorFeedback: "가장 균형 잡힌 대응입니다. 규칙의 투명성과 학생 참여를 동시에 확보했습니다. 학급 자치의 기초를 놓은 좋은 출발점입니다.",
    },
  },
  e5: {
    c1: {
      narrative: "소율이를 달래고 교무실에서 물을 마시게 한 후, 서영이와 나윤이를 따로 불렀습니다. 서영이는 \"장난이었어요\"라고 말했지만, 소율이가 울었다는 걸 듣고 표정이 어두워졌습니다. 나윤이는 \"저는 그냥 따라한 거예요\"라며 미안해했습니다.",
      resourceChanges: { studentTrust: 5, parentSatisfaction: 0, schoolReputation: 3, teacherEnergy: -10 },
      mentorFeedback: "양쪽 이야기를 모두 듣는 것은 중요합니다. 다만, 사이버 왕따는 학교폭력예방법에 해당할 수 있으므로 48시간 내 학교폭력 담당 부장교사에게 보고하는 것도 검토해보세요.",
    },
    c2: {
      narrative: "학교폭력 사안으로 접수했습니다. 서영이 부모님이 \"장난인데 너무 심하게 하는 거 아니냐\"며 항의 전화를 했습니다. 소율이 어머니는 \"감사합니다\"라며 눈물을 보였습니다. 반 분위기가 다소 경직되었습니다.",
      resourceChanges: { studentTrust: -5, parentSatisfaction: -5, schoolReputation: 5, teacherEnergy: -15 },
      mentorFeedback: "절차에 따른 처리는 법적으로 올바릅니다. 하지만 바로 공식 절차로 가면 가해 학생 부모의 반발과 반 분위기 경직이 올 수 있어요. 먼저 사실 확인 후 단계적으로 접근하는 것도 방법입니다.",
    },
    c3: {
      narrative: "\"온라인에서도 예의가 필요하다\"는 주제로 학급 회의를 열었습니다. 학생들이 활발하게 토론했고, 서영이는 약간 불안한 표정이었습니다. 소율이는 발언하지 못했지만, 다른 학생이 \"단톡방에서 사람 빼는 건 나빠\"라고 말해줬습니다.",
      resourceChanges: { studentTrust: 3, parentSatisfaction: 0, schoolReputation: 2, teacherEnergy: -8 },
      mentorFeedback: "전체 토론은 예방 교육으로 좋지만, 피해 학생의 즉각적인 보호가 우선입니다. 소율이에 대한 개별 케어를 병행해야 합니다.",
    },
    c4: {
      narrative: "소율이와 상담하며 자세한 상황을 파악했습니다. 단톡방 캡처를 보니 직접적인 욕설은 없지만 소외시키는 패턴이 있었습니다. 서영이와 상담에서 \"미안해요, 소율이가 그렇게 느낄 줄 몰랐어요\"라는 반응을 얻었습니다.",
      resourceChanges: { studentTrust: 7, parentSatisfaction: 3, schoolReputation: 3, teacherEnergy: -12 },
      mentorFeedback: "개별 상담을 통한 단계적 접근이 좋았습니다. 양쪽의 이야기를 들으면서도 피해 학생을 보호한 균형 잡힌 대응입니다. 이후 관계 회복을 위한 후속 조치도 생각해보세요.",
    },
  },
};

// 기본 결과 (매핑이 없을 때)
export function getDefaultOutcome(choiceApproach: string): MockOutcome {
  switch (choiceApproach) {
    case "authoritative":
      return {
        narrative: "단호한 조치를 취했습니다. 학생들은 규칙의 중요성을 인식했지만, 일부는 \"무섭다\"는 반응을 보였습니다.",
        resourceChanges: { studentTrust: -2, parentSatisfaction: 2, schoolReputation: 3, teacherEnergy: -5 },
        mentorFeedback: "단호한 대응이 필요한 상황이었습니다. 다만, 이후 개별적으로 학생의 감정을 확인해주면 신뢰 회복에 도움이 됩니다.",
      };
    case "democratic":
      return {
        narrative: "학생들의 의견을 들으며 함께 해결책을 찾았습니다. 시간이 좀 걸렸지만 학생들은 만족스러운 표정입니다.",
        resourceChanges: { studentTrust: 4, parentSatisfaction: 1, schoolReputation: 1, teacherEnergy: -8 },
        mentorFeedback: "학생 참여를 이끌어낸 좋은 접근입니다. 시간이 더 걸리지만 장기적으로 학급 자치력이 높아집니다.",
      };
    case "permissive":
      return {
        narrative: "학생의 요구를 수용했습니다. 해당 학생은 기뻐했지만, 다른 학생들이 형평성에 의문을 제기할 수 있습니다.",
        resourceChanges: { studentTrust: 0, parentSatisfaction: -1, schoolReputation: -2, teacherEnergy: -3 },
        mentorFeedback: "유연한 대응이지만, 다른 학생들의 반응도 고려해야 합니다. 일관된 기준이 없으면 혼란이 올 수 있어요.",
      };
    case "professional":
    default:
      return {
        narrative: "전문적인 절차에 따라 차분하게 대응했습니다. 학생들은 선생님의 침착한 모습에 안심한 듯합니다.",
        resourceChanges: { studentTrust: 3, parentSatisfaction: 3, schoolReputation: 3, teacherEnergy: -7 },
        mentorFeedback: "교과서적이지만 안정적인 대응입니다. 상황에 따라 감정적 공감을 더해주면 학생과의 유대가 깊어질 수 있습니다.",
      };
  }
}
