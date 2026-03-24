import { z } from "zod";

export const simulatedOutcomeSchema = z.object({
  narrative: z.string(),
  statChanges: z.array(
    z.object({
      studentSeatNumber: z.number(),
      changes: z.object({
        happiness: z.number().optional(),
        stress: z.number().optional(),
        trustInTeacher: z.number().optional(),
        academicChange: z.number().optional(),
      }),
      newFlags: z.array(z.string()),
      removedFlags: z.array(z.string()),
    })
  ),
  resourceChanges: z.object({
    studentTrust: z.number(),
    parentSatisfaction: z.number(),
    schoolReputation: z.number(),
    teacherEnergy: z.number(),
  }),
  rippleEffects: z.string(),
  futureSeeds: z.array(z.string()),
});

export type ValidatedOutcome = z.infer<typeof simulatedOutcomeSchema>;
