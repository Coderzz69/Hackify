import "server-only";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";

/**
 * Server-only function to fetch the current authenticated user's DB profile.
 * High security: Performs a Clerk-to-Prisma lookup and returns minimal data.
 */
export async function getAuthenticatedUser() {
  const { userId } = await auth();
  if (!userId) return null;

  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      role: true,
    },
  });
}

/**
 * Fetches a user and their skill graph by public slug.
 * High security: Returns only public-safe fields.
 */
export async function getProfileBySlug(slug: string) {
  const profile = await prisma.profile.findUnique({
    where: { publicSlug: slug },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!profile) return null;

  const skillGraph = await prisma.skillGraph.findUnique({
    where: { userId: profile.userId },
    select: {
      overallScore: true,
      skills: true,
    },
  });

  return {
    user: profile.user,
    skillGraph,
    publicSlug: profile.publicSlug,
  };
}

/**
 * Fetches the skill graph for a given user.
 */
export async function getSkillGraph(userId: string) {
  return await prisma.skillGraph.findUnique({
    where: { userId },
    select: {
      overallScore: true,
      skills: true,
      lastUpdated: true,
    },
  });
}

/**
 * Search and filter developers for recruiters.
 * Implements security by strictly checking the caller's role.
 */
export async function searchDevelopers(query: { 
  skill?: string; 
  minScore?: number; 
  limit?: number 
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== "RECRUITER") {
    throw new Error("Forbidden: Recruiter access only");
  }

  const { skill, minScore = 0, limit = 50 } = query;
  const likeSkill = skill ? `%${skill}%` : undefined;

  // Use parameterized query for SQL injection protection
  return await prisma.$queryRaw<any[]>`
    SELECT u.id, u.username, u.name, u.image,
           p."publicSlug", sg."overallScore", sg.skills
    FROM "User" u
    JOIN "Profile" p ON p."userId" = u.id
    JOIN "SkillGraph" sg ON sg."userId" = u.id
    WHERE u.role = 'DEVELOPER'
      AND (${skill ? skill : ""} = '' OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(sg.skills) AS s
        WHERE (s->>'name') ILIKE ${likeSkill ? likeSkill : ""}
          AND (s->>'score')::numeric >= ${minScore}
      ))
    LIMIT ${limit}
  `;
}
