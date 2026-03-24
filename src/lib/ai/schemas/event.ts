import { z } from "zod";

export const presetChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  approach: z.string(),
});

export const generatedEventSchema = z.object({
  eventType: z.enum([
    "bullying",
    "academic",
    "behavior",
    "parent",
    "mental",
    "social",
    "class_mgmt",
    "special",
    "admin",
  ]),
  severity: z.number().min(1).max(5),
  title: z.string(),
  description: z.string(),
  involvedStudentSeatNumbers: z.array(z.number()),
  aiContext: z.string(),
  presetChoices: z.array(presetChoiceSchema).min(3).max(4),
});

export const eventListSchema = z.array(generatedEventSchema).min(1).max(2);

export type ValidatedEvent = z.infer<typeof generatedEventSchema>;
