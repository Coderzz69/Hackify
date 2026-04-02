import "server-only";
import { prisma } from "@/lib/prisma";
import { fetchGithubStats } from "@/lib/github";

/**
 * Aggregates all available developer data for AI analysis.
 * Currently supports: GitHub Stats, User Profile info.
 */
export async function aggregateDeveloperData(userId: string, githubToken?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      skillGraph: true,
    },
  });

  if (!user) throw new Error("User not found");

  let githubData = null;
  if (githubToken) {
    try {
      githubData = await fetchGithubStats(githubToken);
    } catch (error) {
      console.error("GitHub data aggregation failed:", error);
    }
  }

  return {
    profile: {
      name: user.name,
      username: user.username,
      bio: user.profile?.bio,
      role: user.role,
    },
    github: githubData,
    // Future placeholders for LeetCode/LinkedIn
    leetcode: null,
    linkedin: null,
  };
}
