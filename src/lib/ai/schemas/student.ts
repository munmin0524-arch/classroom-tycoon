import { z } from "zod";

export const personalityTypeSchema = z.enum([
  "active",
  "diligent",
  "social",
  "introvert",
  "rebellious",
]);

export const studentProfileSchema = z.object({
  name: z.string(),
  gender: z.enum(["male", "female"]),
  personalityMain: personalityTypeSchema,
  personalitySub: personalityTypeSchema,
  personality: z.object({
    openness: z.number().min(0).max(100),
    conscientiousness: z.number().min(0).max(100),
    extraversion: z.number().min(0).max(100),
    agreeableness: z.number().min(0).max(100),
    neuroticism: z.number().min(0).max(100),
  }),
  academic: z.object({
    korean: z.number().min(0).max(100),
    math: z.number().min(0).max(100),
    english: z.number().min(0).max(100),
    science: z.number().min(0).max(100),
    social: z.number().min(0).max(100),
    overall: z.enum(["top", "middle", "bottom", "uneven"]),
  }),
  family: z.object({
    type: z.enum([
      "stable",
      "dual_income",
      "overprotective",
      "single_parent",
      "low_income",
      "multicultural",
    ]),
    description: z.string(),
  }),
  social: z.object({
    groupType: z.enum(["popular", "quiet", "independent", "isolated"]),
    role: z.enum(["leader", "follower", "boundary", "independent"]),
    friendIds: z.array(z.number()),
  }),
  emotional: z.object({
    happiness: z.number().min(0).max(100),
    stress: z.number().min(0).max(100),
    trustInTeacher: z.number().min(0).max(100),
  }),
  flags: z.array(z.string()),
  hiddenContext: z.string(),
  backstory: z.string(),
});

export const studentListSchema = z.array(studentProfileSchema).length(30);

export type ValidatedStudentProfile = z.infer<typeof studentProfileSchema>;
