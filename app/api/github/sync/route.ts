import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchGithubStats } from "@/lib/github";
import { buildSkillGraph } from "@/lib/skill-graph";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const profile = await prisma.profile.findUnique({ where: { userId } });

  if (profile?.lastGithubSyncAt) {
    const delta = Date.now() - new Date(profile.lastGithubSyncAt).getTime();
    if (delta < ONE_DAY_MS && profile.githubStats) {
      return Response.json({
        cached: true,
        githubStats: profile.githubStats
      });
    }
  }

  const account = await prisma.account.findFirst({
    where: { userId, provider: "github" }
  });

  if (!account?.access_token) {
    return new Response("Missing GitHub access token", { status: 400 });
  }

  const githubStats = await fetchGithubStats(account.access_token);

  const previous = await prisma.skillGraph.findUnique({ where: { userId } });
  const previousGraph = previous
    ? {
        userId,
        skills: previous.skills as any,
        overallScore: previous.overallScore,
        lastUpdated: previous.lastUpdated.toISOString()
      }
    : null;

  const nextGraph = buildSkillGraph({
    userId,
    githubStats,
    previousGraph
  });

  await prisma.profile.upsert({
    where: { userId },
    update: {
      avatarUrl: githubStats.avatarUrl,
      githubUrl: githubStats.profileUrl,
      contactEmail: session.user.email || undefined,
      lastGithubSyncAt: new Date(githubStats.lastSyncedAt),
      githubStats
    },
    create: {
      userId,
      avatarUrl: githubStats.avatarUrl,
      githubUrl: githubStats.profileUrl,
      publicSlug: githubStats.username,
      contactEmail: session.user.email || undefined,
      lastGithubSyncAt: new Date(githubStats.lastSyncedAt),
      githubStats
    }
  });

  await prisma.skillGraph.upsert({
    where: { userId },
    update: {
      skills: nextGraph.skills,
      overallScore: nextGraph.overallScore,
      lastUpdated: new Date(nextGraph.lastUpdated)
    },
    create: {
      userId,
      skills: nextGraph.skills,
      overallScore: nextGraph.overallScore,
      lastUpdated: new Date(nextGraph.lastUpdated)
    }
  });

  await prisma.skillSnapshot.create({
    data: {
      userId,
      snapshot: nextGraph
    }
  });

  return Response.json({
    cached: false,
    githubStats,
    skillGraph: nextGraph
  });
}
