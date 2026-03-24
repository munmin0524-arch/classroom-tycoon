import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai/client";
import { studentListSchema } from "@/lib/ai/schemas/student";
import {
  getStudentGenerationSystemPrompt,
  getStudentGenerationUserPrompt,
} from "@/lib/ai/prompts/student-generation";
import type { SchoolType, Region } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { schoolType, grade, region } = body as {
      schoolType: SchoolType;
      grade: number;
      region: Region;
    };

    // AI로 30명 학생 프로필 생성
    const students = await generateJSON(
      getStudentGenerationSystemPrompt(),
      getStudentGenerationUserPrompt(schoolType, grade, region),
      (data) => studentListSchema.parse(data)
    );

    // TODO: DB에 게임 세션 + 학생 프로필 저장
    // 임시: 메모리에 저장하고 세션 ID 반환
    const sessionId = crypto.randomUUID();

    // 임시 응답 (DB 연동 전)
    return NextResponse.json({
      sessionId,
      students,
      message: `${students.length}명의 학생이 생성되었습니다!`,
    });
  } catch (error) {
    console.error("게임 생성 실패:", error);
    return NextResponse.json(
      { error: "게임 생성에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
