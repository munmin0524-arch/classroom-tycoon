import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const AI_MODEL = "claude-sonnet-4-20250514";

export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  parseAndValidate: (raw: string) => T
): Promise<T> {
  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // JSON 블록 추출 (```json ... ``` 또는 순수 JSON)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);

  if (!jsonMatch) {
    throw new Error("AI 응답에서 JSON을 찾을 수 없습니다");
  }

  const parsed = JSON.parse(jsonMatch[1]);
  return parseAndValidate(parsed);
}

export async function generateText(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
