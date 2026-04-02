import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchGithubStats } from "@/lib/github";
import { buildSkillGraph } from "@/lib/skill-graph";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: Request) {
  await getServerSession(authOptions);
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { role: "DEVELOPER" },
    include: {
      accounts: { where: { provider: "github" } },
      profile: true,
      skillGraph: true
    }
  });

  const results: Array<{ userId: string; updated: boolean }> = [];

  for (const user of users) {
    const account = user.accounts[0];
    if (!account?.access_token) {
      results.push({ userId: user.id, updated: false });
      continue;
    }

    if (user.profile?.lastGithubSyncAt) {
      const delta = Date.now() - user.profile.lastGithubSyncAt.getTime();
      if (delta < ONE_DAY_MS) {
        results.push({ userId: user.id, updated: false });
        continue;
      }
    }

    const githubStats = await fetchGithubStats(account.access_token);
    const previousGraph = user.skillGraph
      ? {
          userId: user.id,
          skills: user.skillGraph.skills as any,
          overallScore: user.skillGraph.overallScore,
          lastUpdated: user.skillGraph.lastUpdated.toISOString()
        }
      : null;

    const nextGraph = buildSkillGraph({
      userId: user.id,
      githubStats,
      previousGraph
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        avatarUrl: githubStats.avatarUrl,
        githubUrl: githubStats.profileUrl,
        contactEmail: user.email || undefined,
        lastGithubSyncAt: new Date(githubStats.lastSyncedAt),
        githubStats
      },
      create: {
        userId: user.id,
        avatarUrl: githubStats.avatarUrl,
        githubUrl: githubStats.profileUrl,
        publicSlug: githubStats.username,
        contactEmail: user.email || undefined,
        lastGithubSyncAt: new Date(githubStats.lastSyncedAt),
        githubStats
      }
    });

    await prisma.skillGraph.upsert({
      where: { userId: user.id },
      update: {
        skills: nextGraph.skills,
        overallScore: nextGraph.overallScore,
        lastUpdated: new Date(nextGraph.lastUpdated)
      },
      create: {
        userId: user.id,
        skills: nextGraph.skills,
        overallScore: nextGraph.overallScore,
        lastUpdated: new Date(nextGraph.lastUpdated)
      }
    });

    await prisma.skillSnapshot.create({
      data: {
        userId: user.id,
        snapshot: nextGraph
      }
    });

    results.push({ userId: user.id, updated: true });
  }

  return Response.json({
    ok: true,
    results
  });
}
