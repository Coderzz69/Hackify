import { skillGraphSchema, type SkillGraph, type Skill } from "@/types/skill-graph";

export type GithubRepoSummary = {
  name: string;
  htmlUrl: string;
  stars: number;
  language: string | null;
  updatedAt: string;
  readmeScore?: number;
};

export type GithubStats = {
  username: string;
  avatarUrl?: string;
  profileUrl?: string;
  totalStars: number;
  totalRepos: number;
  languages: Record<string, number>;
  repos: GithubRepoSummary[];
  commitActivityScore: number;
  readmeScore: number;
  lastSyncedAt: string;
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

const toTrend = (current: number, previous?: number) => {
  if (previous === undefined) return "stable" as const;
  if (current - previous > 2) return "rising" as const;
  if (previous - current > 2) return "declining" as const;
  return "stable" as const;
};

export function buildSkillGraph({
  userId,
  githubStats,
  previousGraph
}: {
  userId: string;
  githubStats: GithubStats;
  previousGraph?: SkillGraph | null;
}): SkillGraph {
  const totalLanguageBytes = Object.values(githubStats.languages).reduce(
    (acc, val) => acc + val,
    0
  );

  const languageEntries = Object.entries(githubStats.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const starScore = clamp(githubStats.totalStars * 2);
  const activityBoost = clamp(githubStats.commitActivityScore);
  const readmeBoost = clamp(githubStats.readmeScore);

  const skills: Skill[] = languageEntries.map(([language, bytes]) => {
    const share = totalLanguageBytes ? bytes / totalLanguageBytes : 0;
    const base = share * 70;
    const score = clamp(base + activityBoost * 0.2 + starScore * 0.1 + readmeBoost * 0.1 + 10);

    const evidence = githubStats.repos
      .filter((repo) => repo.language === language)
      .slice(0, 3)
      .map((repo) => ({
        label: `${repo.name} (${repo.stars}*)`,
        url: repo.htmlUrl,
        weight: 0.3
      }));

    const previousSkill = previousGraph?.skills.find((s) => s.name === language);

    return {
      name: language,
      score,
      evidence,
      lastVerified: githubStats.lastSyncedAt,
      trend: toTrend(score, previousSkill?.score)
    };
  });

  if (!skills.find((skill) => skill.name === "System Design")) {
    const systemScore = clamp((starScore + readmeBoost) / 2);
    skills.push({
      name: "System Design",
      score: systemScore,
      evidence: [
        {
          label: "Repo quality + documentation",
          weight: 0.5
        }
      ],
      lastVerified: githubStats.lastSyncedAt,
      trend: toTrend(systemScore, previousGraph?.skills.find((s) => s.name === "System Design")?.score)
    });
  }

  const overallScore =
    skills.reduce((acc, skill) => acc + skill.score, 0) / (skills.length || 1);

  const graph: SkillGraph = {
    userId,
    skills,
    overallScore: clamp(overallScore),
    lastUpdated: new Date().toISOString()
  };

  return skillGraphSchema.parse(graph);
}

export function applyAiEvaluation({
  graph,
  targetSkill,
  aiScore
}: {
  graph: SkillGraph;
  targetSkill: string;
  aiScore: number;
}): SkillGraph {
  const skills = [...graph.skills];
  const existing = skills.find((skill) => skill.name === targetSkill);

  if (existing) {
    const newScore = clamp(existing.score * 0.4 + aiScore * 0.6);
    const trend = toTrend(newScore, existing.score);
    Object.assign(existing, {
      score: newScore,
      lastVerified: new Date().toISOString(),
      trend
    });
  } else {
    skills.push({
      name: targetSkill,
      score: clamp(aiScore),
      evidence: [{ label: "Hackify Challenge", weight: 0.6 }],
      lastVerified: new Date().toISOString(),
      trend: "rising"
    });
  }

  const overallScore =
    skills.reduce((acc, skill) => acc + skill.score, 0) / (skills.length || 1);

  const nextGraph: SkillGraph = {
    ...graph,
    skills,
    overallScore: clamp(overallScore),
    lastUpdated: new Date().toISOString()
  };

  return skillGraphSchema.parse(nextGraph);
}
