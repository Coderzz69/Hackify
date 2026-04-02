import { z } from "zod";

export const evidenceSchema = z.object({
  label: z.string(),
  url: z.string().url().optional(),
  weight: z.number().min(0).max(1).optional()
});

export const skillSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  evidence: z.array(evidenceSchema),
  lastVerified: z.string(),
  trend: z.enum(["rising", "stable", "declining"])
});

export const skillGraphSchema = z.object({
  userId: z.string(),
  skills: z.array(skillSchema),
  overallScore: z.number().min(0).max(100),
  lastUpdated: z.string()
});

export type Evidence = z.infer<typeof evidenceSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillGraph = z.infer<typeof skillGraphSchema>;

export const evaluationSchema = z.object({
  score: z.number().min(0).max(100),
  breakdown: z.object({
    correctness: z.number().min(0).max(100),
    efficiency: z.number().min(0).max(100),
    readability: z.number().min(0).max(100),
    bestPractices: z.number().min(0).max(100)
  }),
  feedback: z.string()
});

export type EvaluationResult = z.infer<typeof evaluationSchema>;
